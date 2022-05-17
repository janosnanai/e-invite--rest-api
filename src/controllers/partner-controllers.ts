import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";

import HttpError from "../models/http-error";
import { GuestModel, PartnerModel } from "../models/guest-models";

// export const getPartnerById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const partnerId = req.params.partner_id;
//   let partner;

//   try {
//     partner = await PartnerModel.findById(partnerId);
//   } catch (err) {
//     const error = new HttpError(
//       "something went wrong, could not find partner",
//       500
//     );
//     return next(error);
//   }

//   if (!partner) {
//     const error = new HttpError("could not find partner with provided id", 404);
//     return next(error);
//   }
//   res.status(200).json(partner.toObject({ getters: true }));
// };

export const addPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const partnerData = req.body;

  let guest;

  try {
    guest = await GuestModel.findById(guestId);
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

  const newPartner = new PartnerModel({
    ...partnerData,
    partnerOf: guestId,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPartner.save({ session: sess });
    guest.partner = newPartner;
    guest.modifiedDate = new Date().getTime();
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "create partner transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(newPartner.toObject({ getters: true }));
};

export const updatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const partnerUpdateData = req.body;

  let guest;

  try {
    guest = await GuestModel.findById(guestId).populate("partner");
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

  const partner = guest.partner;

  if (!partner) {
    const error = new HttpError("could not find partner", 404);
    return next(error);
  }

  for (const k in partnerUpdateData) {
    partner[k] = partnerUpdateData[k];
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await partner.save({ session: sess });
    guest.modifiedDate = new Date().getTime();
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "update partner transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(partner.toObject({ getters: true }));
};

export const deletePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;

  let guest;

  try {
    guest = await GuestModel.findById(guestId).populate("partner");
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

  const partner = guest.partner;

  if (!partner) {
    const error = new HttpError("could not find partner", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await partner.remove({ session: sess });
    guest.partner = null;
    guest.modifiedDate = new Date().getTime();
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "delete partner transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.sendStatus(200);
};
