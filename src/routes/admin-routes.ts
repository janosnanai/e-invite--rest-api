import express from "express";

import {
  getGuestByVoucherId,
  getGuestList,
  createGuest,
  addPartner,
  addChild,
  deleteGuest,
  deletePartner,
  deleteChild,
  updateGuest,
  updatePartner,
  updateChild,
} from "../controllers/guest-controllers";

const router = express.Router();

router.get("/", getGuestList);
router.get("/:guest_id", getGuestByVoucherId);

router.post("/", createGuest);
router.post("/:guest_id/partner", addPartner);
router.post("/:guest_id/children", addChild);

router.patch("/:guest_id", updateGuest);
router.patch("/:guest_id/partner", updatePartner);
router.patch("/:guest_id/children/:child_id", updateChild);

router.delete("/:guest_id", deleteGuest);
router.delete("/:guest_id/partner", deletePartner);
router.delete("/:guest_id/children/:child_id", deleteChild);

export default router;
