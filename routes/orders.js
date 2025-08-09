import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {getAllActiveOrders, getOrder, newOrder} from "../controllers/order.js";


const router = express.Router();

router.get('/getOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), getOrder);
router.post('/newOrder', verifyToken, authorizeRoles('User', "Manager", "Admin"), newOrder);
router.post('/getAllActiveOrders', verifyToken, authorizeRoles('User', "Manager", "Admin"), getAllActiveOrders);
export default router;