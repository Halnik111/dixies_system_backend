import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {getOrder, newOrder} from "../controllers/order.js";


const router = express.Router();

router.get('/getOrder/:id', verifyToken, getOrder);
router.post('/newOrder', verifyToken, newOrder)

export default router;