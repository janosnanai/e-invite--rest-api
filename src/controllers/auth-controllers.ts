require("dotenv").config();

import { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";

import HttpError from "../models/http-error";
import { ROLES } from "../constants/roles";
import {
  AdminAuthModel,
  UserAuthModel,
  RefreshTokenModel,
} from "../models/auth-models";

import jwt from "jsonwebtoken";

const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET!);
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
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let accessToken;
  let refreshToken;

  await existingUser.populate("guest");
  const guestId = existingUser.guest.id;

  try {
    accessToken = generateAccessToken(guestId, ROLES.GUEST);
    refreshToken = generateRefreshToken(guestId, ROLES.GUEST);

    const newRefreshToken = new RefreshTokenModel({ token: refreshToken });

    await newRefreshToken.save();
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({ accessToken, refreshToken });
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
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let accessToken;
  let refreshToken;

  try {
    accessToken = generateAccessToken(adminId, ROLES.ADMIN);
    refreshToken = generateRefreshToken(adminId, ROLES.ADMIN);

    const newRefreshToken = new RefreshTokenModel({ token: refreshToken });
    await newRefreshToken.save();
  } catch (err) {
    const error = new HttpError("login failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({ adminId, accessToken, refreshToken });
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  let tokenExists;

  try {
    tokenExists = Boolean(
      await RefreshTokenModel.findOne({
        token: refreshToken,
      })
    );
  } catch (err) {
    const error = new HttpError(
      "refresh auth failed, please try again later",
      500
    );
    return next(error);
  }

  if (!tokenExists) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, payload: any) => {
      if (err) return res.sendStatus(401);
      const { id, role } = payload;
      const newAccessToken = generateAccessToken(id, role);
      res.json({ id, token: newAccessToken });
    }
  );
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.token;
  try {
    RefreshTokenModel.deleteOne({ token: refreshToken });
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }

  res.sendStatus(204);
};
