import express from "express";
import {closeTable, getTable, getTables, openTable} from "../controllers/table.js";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";


const router = express.Router();

router.get('/getTables', verifyToken, authorizeRoles('User', "Manager", "Admin"), getTables);
router.get('/getTable/:name', verifyToken, authorizeRoles('User', "Manager", "Admin"), getTable);
router.post('/openTable', verifyToken, authorizeRoles('User', "Manager", "Admin"), openTable);
router.post('/closeTable', verifyToken, authorizeRoles('User', "Manager", "Admin"), closeTable);


export default router;