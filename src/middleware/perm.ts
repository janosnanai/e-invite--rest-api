import { Request, Response, NextFunction } from "express";
import { ROLES } from "../constants/roles";

export const checkPerm = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== ROLES.ADMIN && req.params.guest_id !== req.user.id) {
    res.status(401);
    return res.send();
  }
  next();
};
