import express from "express";
import {pingMe, signIn, signOut, signUp} from "../controllers/auth.js";
import {authorizeRoles, verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.post('/me', verifyToken, authorizeRoles('User', "Manager", "Admin"), pingMe);

export default router;