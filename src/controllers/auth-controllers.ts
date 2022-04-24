import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import HttpError from "../models/http-error";
import { ROLES } from "../constants/roles";
import { AdminAuthModel, UserAuthModel } from "../models/auth-models";

require("dotenv").config();

import jwt from "jsonwebtoken";

const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { voucherId, voucherPass } = req.body;

  let existingUser;

  try {
    existingUser = await UserAuthModel.findOne({ voucherId });
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let isValidPass;

  try {
    isValidPass = await bcrypt.compare(voucherPass, existingUser.voucherPass);
  } catch (err) {
    const error = new HttpError(
      "error while logging in, please try again later",
      500
    );
    return next(error);
  }

  if (!isValidPass) {
    const error = new HttpError("invalid credentials", 403);
    return next(error);
  }

  let accessToken;

  try {
    accessToken = generateAccessToken(existingUser.guest._id, ROLES.GUEST);
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({ accessToken });
};

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { adminId, adminPass } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await AdminAuthModel.findOne({ adminId });
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let isValidPass;

  try {
    isValidPass = await bcrypt.compare(adminPass, existingAdmin.adminPass);
  } catch (err) {
    const error = new HttpError(
      "error while logging in, please try again later",
      500
    );
    return next(error);
  }

  if (!isValidPass) {
    const error = new HttpError("invalid credentials", 403);
    return next(error);
  }

  let accessToken;

  try {
    accessToken = generateAccessToken(adminId, ROLES.ADMIN);
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({ adminId, accessToken });
};
