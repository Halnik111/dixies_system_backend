import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {getMeals} from "../controllers/meal.js";


const router = express.Router();

router.get('/getMeals', verifyToken, authorizeRoles('User', "Manager", "Admin"), getMeals)

export default router;