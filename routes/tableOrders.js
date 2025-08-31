import express from "express";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";
import {
    closeTableOrder,
    editTableOrder,
    getAllActiveTableOrdersWithOrders,
    getTableOrder,
    newTableOrder,
    serveTableOrder,
} from "../controllers/tableOrder.js";


const router = express.Router();

router.get('/getTableOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), getTableOrder);
router.post('/newTableOrder', verifyToken, authorizeRoles('User', "Manager", "Admin"), newTableOrder);
router.put('/editTableOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), editTableOrder);
router.put('/closeTableOrder', verifyToken, authorizeRoles('User', "Manager", "Admin"), closeTableOrder);
router.put('/serveTableOrder/:id', verifyToken, authorizeRoles('User', "Manager", "Admin"), serveTableOrder);
router.get('/getAllActiveTableOrders', verifyToken, authorizeRoles('User', "Manager", "Admin"), getAllActiveTableOrdersWithOrders);
export default router;