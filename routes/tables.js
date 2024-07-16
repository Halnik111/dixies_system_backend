import express from "express";
import {closeTable, getTables, openTable} from "../controllers/table.js";
import {verifyAdminToken, verifyToken} from "../middleware/verifyToken.js";


const router = express.Router();

router.get('/getTables', verifyToken, getTables);
router.post('/openTable', verifyToken, openTable);
router.post('/closeTable', verifyAdminToken, closeTable);


export default router;