import { Request, Response, NextFunction } from "express";
import {
  GuestDocument,
  ChildDocument,
  PartnerDocument,
} from "../types/guest-types";

import { nanoid } from "nanoid";

import { GuestModel, ChildModel, PartnerModel } from "../models/guest-models";

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
  const createdDate = new Date();
  const guestData = req.body;
  const newGuest = new GuestModel({
    voucherId,
    ...guestData,
    isComing: false,
    didReply: false,
    partner: null,
    children: [],
    createdDate,
    modifiedDate: createdDate,
  });
  await newGuest.save();
  res.send(voucherId);
};

export const addPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    const partnerData = req.body;
    const partner = new PartnerModel({
      ...partnerData,
    });
    guest.partner = partner;
    guest.modifiedDate = new Date();
    await guest.save();
  }
};

export const addChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    const childData = req.body;
    const child = new ChildModel({
      ...childData,
    });
    guest.children.push(child);
    guest.modifiedDate = new Date();
    await guest.save();
  }
};

export const deleteGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  await guest.remove();
};

export const deletePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    guest.partner.remove();
    guest.modifiedDate = new Date();
    await guest.save();
  }
};

export const deleteChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    const childId = req.params.child_id;
    const child = guest.children.find(
      (i: ChildDocument) => i._id.toString() === childId
    );
    if (child) {
      child.remove();
      guest.modifiedDate = new Date();
      await guest.save();
    }
  }
};

export const updateGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  for (const k in req.body) {
    guest[k] = req.body[k]; // memo for future me: only send props that have changed!!
  }
  guest.modifiedDate = new Date();
  await guest.save();
};

export const updatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    const partner = guest.partner;
    if (partner) {
      for (const k in req.body) {
        partner[k] = req.body[k]; // memo for future me: only send props that have changed!!
      }
    }
    guest.modifiedDate = new Date();
    await guest.save();
  }
};

export const updateChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const guestId = req.params.guest_id;
  const guest = await GuestModel.findOne({ voucherId: guestId });
  if (guest) {
    const childId = req.params.guest_id;
    const child = await ChildModel.findById(childId);
    if (child) {
      for (const k in req.body) {
        child[k] = req.body[k]; // memo for future me: only send props that have changed!!
      }
      guest.modifiedDate = new Date();
      await guest.save();
    }
  }
};
