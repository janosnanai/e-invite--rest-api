import { ROLES } from "../constants/roles";

import express from "express";

import {
  getGuestById,
  getGuestList,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../controllers/guest-controllers";

import {
  addPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partner-controllers";

import {
  addChild,
  deleteChild,
  updateChild,
} from "../controllers/child-controllers";

import { authenticateToken, checkRole } from "../middleware/auth";
import { checkPerm } from "../middleware/perm";

const router = express.Router();

router.use(authenticateToken);

// GET
router.get("/", checkRole([ROLES.ADMIN]), getGuestList);

router.get(
  "/:guest_id",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  getGuestById
);

// POST
router.post("/", checkRole([ROLES.ADMIN]), createGuest);

router.post(
  "/:guest_id/partner",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  addPartner
);

router.post(
  "/:guest_id/children",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  addChild
);

// PATCH
router.patch(
  "/:guest_id",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  updateGuest
);

router.patch(
  "/:guest_id/partner",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  updatePartner
);

router.patch(
  "/:guest_id/children/:child_id",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  updateChild
);

// DELETE
router.delete("/:guest_id", checkRole([ROLES.ADMIN]), deleteGuest);

router.delete(
  "/:guest_id/partner",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  deletePartner
);

router.delete(
  "/:guest_id/children/:child_id",
  checkRole([ROLES.GUEST, ROLES.ADMIN]),
  checkPerm,
  deleteChild
);

export default router;
