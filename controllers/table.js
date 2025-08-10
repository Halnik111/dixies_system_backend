import Table from "../models/Table.js";
import Order from "../models/Order.js";

export const getTables = async (req, res) => {

    const tables = await Table.find({});
    if (tables) res.status(200).json(tables);
};

export const getTable = async (req, res) => {
    const table = await Table.findOne({name: req.params.name});
    if (table) res.status(200).json(table);
    else res.status(404).json("Table not found");
}

export const openTable = async (req, res) => {
    await Table.findOneAndUpdate({name: req.body.table}, {status: 'taken', orderId: req.body.orderId})
        .then(() => {
            res.status(200).json('Table opened!');
        })
        .catch(err => {
            res.status(409).json("message: " + err.message);
        })
}

export const closeTable = async (req, res) => {
    await Table.findOneAndUpdate({_id: req.body.table}, {status: 'open', orderId: ''}, {new: false})
        .then( async(data) => {
            console.log(data.orderId)
            const test = await Order.findByIdAndUpdate(
                data.orderId,
                { closedAt: new Date() },
                { new: true }
            );
            console.log(test)
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(409).json("message: " + err.message);
        })
}