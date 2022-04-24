import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";

import HttpError from "../models/http-error";
import { GuestModel, ChildModel } from "../models/guest-models";

// export const getChildById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const childId = req.params.child_id;
//   let child;

//   try {
//     child = await ChildModel.findById(childId);
//   } catch (err) {
//     const error = new HttpError(
//       "something went wrong, could not find child",
//       500
//     );
//     return next(error);
//   }

//   if (!child) {
//     const error = new HttpError("could not find child with provided id", 404);
//     return next(error);
//   }
//   res.status(200).json(child.toObject({ getters: true }));
// };

export const addChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const childData = req.body;

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

  const newChild = new ChildModel({
    ...childData,
    parent: guestId,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newChild.save({ session: sess });
    guest.children.push(newChild);
    guest.modifiedDate = new Date().getTime();
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "create child transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(newChild.toObject({ getters: true }));
};

export const updateChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const childId = req.params.child_id;
  const childUpdateData = req.body;

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

  let child;

  try {
    child = await ChildModel.findById(childId);
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!child) {
    const error = new HttpError("could not find child", 404);
    return next(error);
  }

  for (const k in childUpdateData) {
    child[k] = childUpdateData[k];
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await child.save({ session: sess });
    guest.modifiedDate = new Date().getTime();
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "update child transaction failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json(child.toObject({ getters: true }));
};

export const deleteChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const childId = req.params.child_id;

  let guest;

  try {
    guest = await GuestModel.findOne({ _id: guestId });
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

  let child;

  try {
    child = await ChildModel.findById(childId);
  } catch (err) {
    const error = new HttpError(
      "something went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!child) {
    const error = new HttpError("could not find child", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await child.remove({ session: sess });
    guest.children.pull(child);
    await guest.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "something went wrong with transaction, could not delete place",
      500
    );
    return next(error);
  }
  res.sendStatus(200);
};
