import express from "express";

import {
  userLogin,
  adminLogin,
  refreshAccessToken,
  logout,
} from "../controllers/auth-controllers";

const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/user-login", userLogin);
router.post("/token", refreshAccessToken);
router.post("/logout", logout);

export default router;
