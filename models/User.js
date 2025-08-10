import mongoose from "mongoose";
import {DateTime} from "luxon";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: "User",
    }
},
    {timestamps: true}
);

userSchema.set("toJSON", {
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

export default mongoose.model("User", userSchema);