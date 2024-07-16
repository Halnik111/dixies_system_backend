import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
    },
    },
    {timestamps: true}
);

export default mongoose.model("Tables", TableSchema, "tables");