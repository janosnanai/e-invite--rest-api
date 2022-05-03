import { Request, Response, NextFunction } from "express";
import { ChildDocument } from "../types/guest-types";

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import HttpError from "../models/http-error";
import { GuestModel } from "../models/guest-models";
import { UserAuthModel } from "../models/auth-models";

export const getGuestList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let guestList;
  try {
    guestList = await GuestModel.find({})
      .populate("partner")
      .populate("children");
  } catch (err) {
    const error = new HttpError(
      "fetching guests failed, please try again later",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json(guestList.map((guest) => guest.toObject({ getters: true })));
};

export const getGuestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;

  let guest;

  try {
    guest = await GuestModel.findById(guestId)
      .populate("partner")
      .populate("children");
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!guest) {
    const error = new HttpError("could not find guest", 404);
    return next(error);
  }

  res.status(200).json(guest.toObject({ getters: true }));
};

export const createGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { voucherId, voucherPass, firstName, lastName, nickName } = req.body;

  let existingUser;

  try {
    existingUser = await UserAuthModel.findOne({ voucherId });
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("user already exists", 422);
    return next(error);
  }

  let voucherPassHash;

  try {
    voucherPassHash = await bcrypt.hash(voucherPass, 12);
  } catch (err) {
    const error = new HttpError(
      "could not create user, please try again later",
      500
    );
    return next(error);
  }

  const createdDate = new Date().getTime();

  const newUserAuthData = {
    voucherId,
    voucherPass: voucherPassHash,
  };

  const newGuestData = {
    firstName,
    lastName,
    nickName,
    email: "",
    phone: "",
    isComing: false,
    didReply: false,
    foodGlutenFree: false,
    foodLactoseFree: false,
    foodDiabetic: false,
    partner: null,
    children: [],
    createdDate,
    modifiedDate: createdDate,
  };

  const newGuest = new GuestModel({
    ...newGuestData,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newGuest.save({ session: sess });
    const newUserAuth = new UserAuthModel({
      ...newUserAuthData,
      guest: newGuest._id,
    });
    await newUserAuth.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "create user transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(newGuest.toObject({ getters: true }));
};

export const updateGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;

  let guest;

  try {
    guest = await GuestModel.findById(guestId)
      .populate("partner")
      .populate("children");
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!guest) {
    const error = new HttpError("could not find guest", 404);
    return next(error);
  }

  for (const k in req.body) {
    guest[k] = req.body[k];
  }

  guest.modifiedDate = new Date().getTime();

  try {
    await guest.save();
  } catch (err) {
    const error = new HttpError(
      "update guest failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(guest.toObject({ getters: true }));
};

export const deleteGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;

  let guest;

  try {
    guest = await GuestModel.findById(guestId)
      .populate("partner")
      .populate("children");
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!guest) {
    const error = new HttpError("could not find guest", 404);
    return next(error);
  }

  let user;

  try {
    user = await UserAuthModel.findOne({ guest: guest._id });
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find user", 404);
    return next(error);
  }

  const partner = guest.partner;
  const children = guest.children;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    if (partner) {
      await partner.remove({ session: sess });
    }
    if (children.length) {
      children.forEach(async (child: ChildDocument) => {
        await child.remove({ session: sess });
      });
    }
    await guest.remove({ session: sess });
    await user.remove({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "delete guest transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.sendStatus(200);
};
