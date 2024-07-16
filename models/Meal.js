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
        }
    },
    {timestamps: true}
);

export default mongoose.model("Meals", MealSchema, "meals");