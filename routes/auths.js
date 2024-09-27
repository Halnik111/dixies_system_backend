import express from "express";
import {pingLocalStorage, signIn, signOut, signUp} from "../controllers/auth.js";

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.post('/ping', pingLocalStorage);

export default router;