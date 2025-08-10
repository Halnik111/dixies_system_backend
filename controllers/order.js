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
        const order = new Order({meals: model.orders, openedBy: model.currentUser, tableId: model.table, price: model.totalPriceRound})
        await order.save();
        res.status(201).json(order)
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const editOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
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
    let orders = req.body.orders;
    // Filter out empty or invalid IDs
    orders = orders.filter(id => mongoose.Types.ObjectId.isValid(id));
    try{
        await Order.find({ _id: { $in: orders } })
            .then(data => {
                res.status(200).json(data);
            })
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const closeOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const closedOrder = await Order.findByIdAndUpdate(
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
        const closedOrder = await Order.findByIdAndUpdate(
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