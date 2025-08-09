import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getOrder = async (req, res) => {
    try{
        await Order.findById(req.params.id)
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
        console.log(model)
        const order = new Order({meals: model.orders, openedBy: model.currentUser, tableId: model.table, price: model.totalPriceRound})
        await order.save();
        res.status(201).json(order)
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const getAllActiveOrders = async (req, res) => {
    let orders = req.body.orders;
    // Filter out empty or invalid IDs
    orders = orders.filter(id => mongoose.Types.ObjectId.isValid(id));
    try{
        await Order.find({ _id: { $in: orders } })
            .then(data => {
                console.log(data + " data")
                res.status(200).json(data);
            })
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}