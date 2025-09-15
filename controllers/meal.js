import Meal from "../models/Meal.js";

export const getMeals = async (req, res) => {
    try {
        const menu = await Meal.find({});
        res.status(200).json(menu);
    } catch (err) {
        res.json("message: " + err.message);
    }
};

export const updateMeal = async (req, res) => {
    const {id} = req.params;
    const meal = req.body;
    try {
        const updatedMeal = await Meal.findByIdAndUpdate(id, meal, {new: true});
        res.status(200).json(updatedMeal);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}

export const createMeal = async (req, res) => {
    const meal = req.body;
    const newMeal = new Meal(meal);
    try {
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}