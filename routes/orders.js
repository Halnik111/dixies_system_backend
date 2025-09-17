import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {
    closeOrder,
    editOrder,
    getAllActiveOrders,
    getOrder, listOrders,
    newOrder,
    serveOrder,
} from "../controllers/order.js";


const router = express.Router();

router.get('/getOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), getOrder);
router.post('/newOrder', verifyToken, authorizeRoles('User', "Manager", "Admin"), newOrder);
router.get('/getAllActiveOrders', verifyToken, authorizeRoles('User', "Manager", "Admin"), getAllActiveOrders);
router.put('/editOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), editOrder);
router.put('/closeOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), closeOrder);
router.put('/serveOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), serveOrder);
router.get('/listOrders', verifyToken, authorizeRoles('User', "Manager", "Admin"), listOrders);
export default router;