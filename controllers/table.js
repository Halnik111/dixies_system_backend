import Table from "../models/Table.js";

export const getTables = async (req, res) => {

    const tables = await Table.find({});
    if (tables) res.status(200).json(tables);
};

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
    await Table.findOneAndUpdate({_id: req.body.table}, {status: 'open', orderId: ''}, {new: true})
        .then((data) => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(409).json("message: " + err.message);
        })
}