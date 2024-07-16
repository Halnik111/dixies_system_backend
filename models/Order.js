import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
        meals: {
            type: [],
            required: true,
        },
        openedBy: {
            type: Object,
            required: true,
        },
        tableId: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

export default mongoose.model("Orders", OrderSchema, "orders");