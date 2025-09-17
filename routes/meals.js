import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {getMeals, reorderMeals} from "../controllers/meal.js";
import { updateMeal } from "../controllers/meal.js";
import { createMeal } from "../controllers/meal.js";


const router = express.Router();

router.get('/getMeals', verifyToken, authorizeRoles('User', "Manager", "Admin"), getMeals);
router.put('/:id', verifyToken, authorizeRoles('Manager', "Admin"), updateMeal);
router.post('/', verifyToken, authorizeRoles('Manager', "Admin"), createMeal);
router.patch('/reorder', verifyToken, authorizeRoles('Manager', "Admin"), reorderMeals);

export default router;