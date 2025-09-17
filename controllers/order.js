import TableOrder from "../models/TableOrder.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export const getOrder = async (req, res) => {
    try{
        await TableOrder.findById(req.params.id)
            .then(data => {
               res.status(200).json(data);
            })
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const newOrder = async (req, res) => {
    try{
        const model = req.body;
        const order = new TableOrder({orderIDs: model.orders, openedBy: model.openedBy, tableId: model.table, price: model.totalPriceRound})
        await order.save();
        res.status(201).json(order)
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const listOrders = async (req, res) => {
    try {
        const { since, until, limit = 500, sort = "desc" } = req.query;

        const q = {};
        if (since || until) {
            q.createdAt = {};
            if (since) q.createdAt.$gte = new Date(since);
            q.createdAt.$lt = new Date(until || Date.now());
        }

        const items = await Order.find(q)
            .sort({ createdAt: sort === "asc" ? 1 : -1 })
            .limit(Math.min(Number(limit) || 500, 5000))
            .lean();

        res.status(200).json({ orders: items });
    } catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};


export const editOrder = async (req, res) => {
    try {
        const updatedOrder = await TableOrder.findByIdAndUpdate(
            req.params.id,
            {
                meals: req.body.orders,
                openedBy: req.body.currentUser,
                tableId: req.body.table,
                price: req.body.totalPriceRound
            },
            { new: true, runValidators: true }
        );
        console.log(updatedOrder);
        if (!updatedOrder) {
            return res.status(404).json("Order not found");
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}

export const getAllActiveOrders = async (req, res) => {
    try{
        await Order.find({ closedAt: null})
            .then(data => {
                res.status(200).json(data);
            })
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const closeOrder = async (req, res) => {
    try {
        const orderId = req.body.order;
        console.log('asd')
        const closedOrder = await TableOrder.findByIdAndUpdate(
            orderId,
            { closedAt: new Date() },
            { new: true }
        );
        if (!closedOrder) {
            return res.status(404).json("Order not found");
        }
        res.status(200).json(closedOrder);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}

export const serveOrder = async (req, res) => {
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
}