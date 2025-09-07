import TableOrder from "../models/TableOrder.js";
import mongoose, {Types} from "mongoose";
import Order from "../models/Order.js";
import {DateTime} from "luxon";


export const getTableOrder = async (req, res) => {
    try{
        await TableOrder.findById(req.params.id)
            .then(data => {
                res.status(200).json(data);
            })
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const newTableOrder = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { openedBy, tableId, price, orders } = req.body;
            // orders = [{ items:[...], status?, totalPrice? }, ...]  (shape as you defined)

            // 1) Pre-generate parent id
            const tableOrderId = new Types.ObjectId();

            // 2) Create parent
            await TableOrder.create([{
                _id: tableOrderId,
                orderIds: [],            // or omit if not required at creation
                openedBy,
                tableId,
                price,
                servedAt: null,
                closedAt: null,
            }], { session });

            // 3) Create children with FK to parent
            const orderDocs = orders.map(o => ({
                ...o,
                _id: new Types.ObjectId(), // pre-generate child id
                mealIDs: o.meals.map(m => m.meal._id), // extract meal IDs
                tableOrderId,            // <- link to parent
            }));
            const createdOrders = await Order.insertMany(orderDocs, { session });

            // 4) Update parent with children ids
            const createdIds = createdOrders.map(o => o._id);
            await TableOrder.updateOne(
                { _id: tableOrderId },
                { $set: { orderIds: createdIds } },
                { session }
            );

            // optional: fetch final doc to return (one query, still in txn)
            const final = await TableOrder.findById(tableOrderId)
                .populate("orderIds")
                .lean()
                .session(session);

            res.status(201).json(final);
        });
    } catch (err) {
        res.status(409).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

export const editTableOrder = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { tableId, price, orders } = req.body;
            const tableOrderId = req.params.id;

            // 1) Update parent TableOrder
            await TableOrder.findByIdAndUpdate(
                tableOrderId,
                {
                    tableId,
                    price,
                    servedAt: null,
                    closedAt: null,
                },
                { session, new: true, runValidators: true }
            );

            // 2) Remove old child orders
            await Order.deleteMany({ tableOrderId }, { session });

            // 3) Create new child orders
            const orderDocs = orders.map(o => ({
                ...o,
                _id: new Types.ObjectId(),
                mealIDs: o.meals.map(m => m.meal._id),
                tableOrderId,
            }));
            const createdOrders = await Order.insertMany(orderDocs, { session });

            // 4) Update parent with new child order IDs
            const createdIds = createdOrders.map(o => o._id);
            await TableOrder.updateOne(
                { _id: tableOrderId },
                { $set: { orderIds: createdIds } },
                { session }
            );

            // 5) Return updated TableOrder with populated orders
            const final = await TableOrder.findById(tableOrderId)
                .populate("orderIds")
                .lean()
                .session(session);

            res.status(200).json(final);
        });
    } catch (err) {
        res.status(409).json({ message: err.message });
    } finally {
        session.endSession();
    }
};



export const closeTableOrder = async (req, res) => {
    
};

export const serveTableOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const closedOrder = await TableOrder.findByIdAndUpdate(
            orderId,
            { servedAt: new Date() },
            { new: true }
        );
        if (!closedOrder) {
            return res.status(404).json("Order not found");
        }
        res.status(200).json(closedOrder);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const getAllActiveTableOrdersWithOrders = async (req, res) => {
    try {
        const result = await TableOrder.aggregate([
            // 1) only active tableOrders
            { $match: { closedAt: null } },

            // 2) convert string ids -> ObjectId[]
            {
                $addFields: {
                    orderObjectIds: {
                        $map: {
                            input: '$orderIds',
                            as: 'oid',
                            in: {
                                $cond: [
                                    { $regexMatch: { input: '$$oid', regex: /^[0-9a-fA-F]{24}$/ } },
                                    { $toObjectId: '$$oid' },
                                    // if somehow not a valid ObjectId string, drop it
                                    // you could also keep it and let the lookup miss
                                    '$$REMOVE'
                                ]
                            }
                        }
                    }
                }
            },

            // 3) lookup full orders
            {
                $lookup: {
                    from: 'orders',                // <- collection name
                    localField: 'orderObjectIds',  // <- ObjectId array we just built
                    foreignField: '_id',
                    as: 'orders'
                }
            },

            // 4) optional: clean helper field
            { $project: { orderObjectIds: 0 } },

            // 5) optional: newest first
            { $sort: { createdAt: -1 } }
        ]);

        const formatDate = (date) =>
            date
                ? DateTime.fromJSDate(date).setZone("Europe/Berlin").toFormat("yyyy-MM-dd HH:mm:ss")
                : null;
        
        const formatted = result.map(doc => ({
            ...doc,
            createdAt: formatDate(doc.createdAt),
            updatedAt: formatDate(doc.updatedAt),
            servedAt: formatDate(doc.servedAt),
            closedAt: formatDate(doc.closedAt),
        }));
        
        res.json(formatted);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to load active table orders' });
    }
};

export const getAllActiveTableOrders = async () => {
    try {
        const result = await TableOrder.aggregate([
            // 1) only active tableOrders
            {$match: {closedAt: null}},

            // 2) convert string ids -> ObjectId[]
            {
                $addFields: {
                    orderObjectIds: {
                        $map: {
                            input: '$orderIds',
                            as: 'oid',
                            in: {
                                $cond: [
                                    {$regexMatch: {input: '$$oid', regex: /^[0-9a-fA-F]{24}$/}},
                                    {$toObjectId: '$$oid'},
                                    // if somehow not a valid ObjectId string, drop it
                                    // you could also keep it and let the lookup miss
                                    '$$REMOVE'
                                ]
                            }
                        }
                    }
                }
            },

            // 3) lookup full orders
            {
                $lookup: {
                    from: 'orders',                // <- collection name
                    localField: 'orderObjectIds',  // <- ObjectId array we just built
                    foreignField: '_id',
                    as: 'orders'
                }
            },

            // 4) optional: clean helper field
            {$project: {orderObjectIds: 0}},

            // 5) optional: newest first
            {$sort: {createdAt: -1}}
        ]);

        const formatDate = (date) =>
            date
                ? DateTime.fromJSDate(date).setZone("Europe/Berlin").toFormat("yyyy-MM-dd HH:mm:ss")
                : null;

        const formatted = result.map(doc => ({
            ...doc,
            createdAt: formatDate(doc.createdAt),
            updatedAt: formatDate(doc.updatedAt),
            servedAt: formatDate(doc.servedAt),
            closedAt: formatDate(doc.closedAt),
        }));
        
        console.log(formatted);
        
        return formatted;
    } catch (e) {
        console.error(e);
    }
};
