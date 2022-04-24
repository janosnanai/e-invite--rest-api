require("dotenv").config();

import { Request, Response, NextFunction } from "express";
// import { UserDataJwtPayload } from "../types/auth-types";
// import { UserDataRequest } from "../types/auth-types";
import jwt from "jsonwebtoken";

export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = await req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (err) return res.sendStatus(403);
        req.user = { id: payload!.id, role: payload!.role };
      }
    );
  } catch (err) {
    return next(err);
  }
  next();
};

export const checkRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    let userRole;
    if (!userRole) {
      userRole = req.user.role;
    }
    if (!roles.includes(userRole)) {
      return res.sendStatus(401);
    }
    next();
  };
};
