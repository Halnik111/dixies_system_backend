import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        sortIndex: {
            type: Number,
            default: 0,
        },
        available: {
            type: Boolean,
            default: true,
        }
    },
    {timestamps: true}
);

MealSchema.index({ category: 1, sortIndex: 1, available: 1 });

export default mongoose.model("Meals", MealSchema, "meals");