import Table from "../models/Table.js";
import Order from "../models/Order.js";
import TableOrder from "../models/TableOrder.js";
import mongoose from "mongoose";

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
    console.log(req.body.table)
    await Table.findOneAndUpdate({name: req.body.table.name}, {status: 'taken', tableOrderId: req.body.tableOrderId})
        .then(() => {
            res.status(200).json('Table opened!');
        })
        .catch(err => {
            res.status(409).json("message: " + err.message);
        })
}

export const closeTable = async (req, res) => {
    const { tableId, closedBy } = req.body; // add payment info if needed
    const session = await mongoose.startSession();
    const now = new Date();

    try {
        let payload = {};
        await session.withTransaction(async () => {
            // 1) get the table with an active tableOrder
            const table = await Table.findOne({ _id: tableId }).session(session);
            if (!table || !table.tableOrderId) {
                // idempotent: nothing to close
                payload = { ok: true, message: 'No active tableOrder for this table' };
                return;
            }

            // 2) ensure the tableOrder is still open (avoid double-close races)
            const to = await TableOrder.findOne({
                _id: table.tableOrderId,
                closedAt: null
            }).session(session);

            if (!to) {
                // already closed; just free the table if it's still pointing at it
                await Table.updateOne(
                    { _id: tableId, tableOrderId: table.tableOrderId },
                    { $set: { status: 'open', tableOrderId: '' } }
                ).session(session);
                payload = { ok: true, message: 'TableOrder was already closed' };
                return;
            }

            // 3) (optional) finalize price here if you recalc; else keep stored TableOrder.price
            // const orders = await Order.find({ tableOrderId: String(to._id) }).session(session);
            // const finalTotal = orders.reduce((sum, o) => sum + parseFloat(o.price), 0).toFixed(2);

            // 4) mark orders closed (add closedAt field to Order schema if you want explicit state)
            // await Order.updateMany(
            //   { tableOrderId: String(to._id) },
            //   { $set: { closedAt: now } }
            // ).session(session);

            // 5) close the tableOrder
            await TableOrder.updateOne(
                { _id: to._id, closedAt: null },
                { $set: { closedAt: now /*, price: finalTotal */ , closedBy } }
            ).session(session);

            // 6) free the table
            await Table.updateOne(
                { _id: tableId, tableOrderId: String(to._id) },
                { $set: { status: 'open', tableOrderId: '' } }
            ).session(session);

            payload = { ok: true, tableId, tableOrderId: String(to._id) };
        });

        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    } finally {
        session.endSession();
    }
}