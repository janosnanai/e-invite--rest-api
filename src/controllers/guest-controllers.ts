import { Request, Response, NextFunction } from "express";
import {
  GuestDocument,
  ChildDocument,
  PartnerDocument,
} from "../types/guest-types";

import { GuestModel, ChildModel, PartnerModel } from "../models/guest-models";

export const getGuestList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestList: GuestDocument[] | [] = await GuestModel.find({});
  res.send(guestList);
};

export const getGuestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  res.send(guest);
};

export const createGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestData = req.body;
  const newGuest = new GuestModel({
    ...guestData,
    isComing: false,
    didReply: false,
    children: [],
  });
  await newGuest.save();
};

export const addPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    const partnerData = req.body;
    const partner = new PartnerModel({
      ...partnerData,
    });
    guest.partner = partner;
    await guest.save();
  }
};

export const addChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    const childData = req.body;
    const child = new ChildModel({
      ...childData,
    });
    guest.children.push(child);
    await guest.save();
  }
};

export const deleteGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  await guest.remove();
};

export const deletePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    guest.partner.remove();
    await guest.save();
  }
};

export const deleteChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    const childId = req.params.child_id;
    guest.children.filter((child: ChildDocument) => child._id !== childId);
    await guest.save();
  }
};

export const updateGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  for (const k in req.body) {
    guest[k] = req.body[k]; // memo for future me: only send props that have changed!!
  }
  await guest.save();
};

export const updatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    const partner = guest.partner;
    if (partner) {
      for (const k in req.body) {
        partner[k] = req.body[k]; // memo for future me: only send props that have changed!!
      }
    }
    await guest.save();
  }
};

export const updateChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findById(guestId);
  if (guest) {
    const childId = req.params.guest_id;
    const child = await ChildModel.findById(childId);
    if (child) {
      for (const k in req.body) {
        child[k] = req.body[k]; // memo for future me: only send props that have changed!!
      }
    }
    await guest.save();
  }
};
