import { Request, Response, NextFunction } from "express";
import { ROLES } from "../constants/roles";

// Check whether the user has ADMIN role or has the matching ID

export const checkPerm = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== ROLES.ADMIN && req.params.guest_id !== req.user.id) {
    res.status(403);
    return res.send();
  }
  next();
};
