import mongoose from "mongoose";
import {DateTime} from "luxon";

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

// Automatically format timestamps to Europe/Berlin when sending JSON
TableSchema.set("toJSON", {
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

export default mongoose.model("Tables", TableSchema, "tables");