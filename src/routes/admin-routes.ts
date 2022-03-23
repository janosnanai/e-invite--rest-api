import express from "express";

import {
  createGuest,
  deleteGuest,
  getGuestById,
  getGuestList,
  updateGuest,
} from "../controllers/guest-controllers";

const router = express.Router();

router.get("/", getGuestList);
router.get("/:guest_id", getGuestById);
router.post("/", createGuest);
router.patch("/:guest_id", updateGuest);
router.delete("/:guest_id", deleteGuest);

export default router;
