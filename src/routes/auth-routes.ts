import express from "express";

import { userLogin, adminLogin } from "../controllers/auth-controllers";

const router = express.Router();

router.post("/admin", adminLogin);
router.post("/user", userLogin);

export default router;
