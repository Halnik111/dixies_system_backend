import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {getMeals} from "../controllers/meal.js";


const router = express.Router();

router.get('/getMeals', verifyToken, getMeals)

export default router;