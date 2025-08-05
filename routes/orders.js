import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {getOrder, newOrder} from "../controllers/order.js";


const router = express.Router();

router.get('/getOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), getOrder);
router.post('/newOrder', verifyToken, authorizeRoles('User', "Manager", "Admin"), newOrder)

export default router;