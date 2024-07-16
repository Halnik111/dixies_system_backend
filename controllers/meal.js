import Meal from "../models/Meal.js";

export const getMeals = async (req, res) => {
    try {
        const menu = await Meal.find({});
        res.status(200).json(menu);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
};