import mongoose from "mongoose";
import {DateTime} from "luxon";

const TableOrder = new mongoose.Schema({
        orderIds: {
            type: [String],
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
            type: Number,
            required: true
        },
        servedAt: {
            type: Date,
            default: null
        },
        closedAt: {
            type: Date,
            default: null
        },
    },
    {timestamps: true}
);

TableOrder.set("toJSON", {
    transform: (doc, ret) => {
        const formatDate = (date) =>
            DateTime.fromJSDate(date)
                .setZone("Europe/Berlin")
                .toFormat("yyyy-MM-dd HH:mm:ss");

        if (ret.createdAt) {
            ret.createdAt = formatDate(ret.createdAt);
        }
        if (ret.updatedAt) {
            ret.updatedAt = formatDate(ret.updatedAt);
        }

        return ret;
    },
});

export default mongoose.model("TableOrders", TableOrder, "tableOrders");