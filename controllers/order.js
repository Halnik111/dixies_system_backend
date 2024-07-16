import Order from "../models/Order.js";
import orders from "../routes/orders.js";

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
        const order = new Order({meals: model.orders, openedBy: model.currentUser, tableId: model.table, price: model.totalPrice})
        await order.save();
        res.status(201).json(order)
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};