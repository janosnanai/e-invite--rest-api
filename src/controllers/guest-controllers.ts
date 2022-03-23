import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

import GuestModel from "../models/guest-models";

import { GuestData } from "../types/guest-types";

export const getGuestList = async () => {
  const guestList: GuestData[] | [] = await GuestModel.find({});
  return guestList;
};

export const getGuestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.guest_id;
  const guest: GuestData | null = await GuestModel.findOne({ id });
  return guest;
};

export const createGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestData: GuestData = req.body; // probably send it with a dummy id and generate actual id here?
  const newGuest = new GuestModel({ ...guestData, id: nanoid() });
  await newGuest.save();
};

export const deleteGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.guest_id;
  const guest = await GuestModel.findOne({ id });
  await guest.remove();
};

export const updateGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.guest_id;
  const guest = await GuestModel.findOne({ id });
  for (const k in req.body) {
    guest[k] = req.body[k]; // memo for future me: only send props that have changed!!
  }
  await guest.save();
};
