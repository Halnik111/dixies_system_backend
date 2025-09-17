import Meal from "../models/Meal.js";

export const getMeals = async (req, res) => {
    try {
        const menu = await Meal.find({}).sort({ category: 1, sortIndex: 1, name: 1 });

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

// controllers/meals.js
export const reorderMeals = async (req, res) => {
    const { category, ids } = req.body;
    if (!category || !Array.isArray(ids)) return res.status(400).json({ message: "Invalid payload" });

    const ops = ids.map((id, i) => ({
        updateOne: { filter: { _id: id, category }, update: { $set: { sortIndex: i } } }
    }));
    await Meal.bulkWrite(ops);
    res.json({ ok: true });
};
