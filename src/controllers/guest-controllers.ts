import { Request, Response, NextFunction } from "express";
import { GuestDocument } from "../types/guest-types";

import { nanoid } from "nanoid";

import { GuestModel } from "../models/guest-models";

export const getGuestList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestList: GuestDocument[] | [] = await GuestModel.find({});
  res.send(guestList);
};

export const getGuestByVoucherId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  res.send(guest);
};

export const createGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const voucherId = nanoid();
  const createdDate = new Date().getTime();
  const guestData = {
    ...req.body,
    voucherId,
    email: "",
    phone: "",
    isComing: false,
    didReply: false,
    foodGlutenFree: false,
    foodLactoseFree: false,
    foodDiabetic: false,
    children: [],
    createdDate,
    modifiedDate: createdDate,
  };
  const newGuest = new GuestModel({
    ...guestData,
  });
  await newGuest.save();
  res.send(guestData);
};

export const updateGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  for (const k in req.body) {
    guest[k] = req.body[k];
  }
  guest.modifiedDate = new Date().getTime();
  await guest.save();
  res.send(guest);
};

export const deleteGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  await guest.remove();
  res.send();
};
