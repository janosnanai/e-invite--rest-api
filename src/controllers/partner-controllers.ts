import { Request, Response, NextFunction } from "express";

import { nanoid } from "nanoid";

import { GuestModel, PartnerModel } from "../models/guest-models";

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
    res.send(partner);
  }
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
        partner[k] = req.body[k];
      }
    }
    guest.modifiedDate = new Date();
    await guest.save();
    res.send(partner);
  }
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
