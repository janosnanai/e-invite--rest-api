import { Request, Response, NextFunction } from "express";
import { ChildDocument } from "../types/guest-types";

import { nanoid } from "nanoid";

import { GuestModel, ChildModel } from "../models/guest-models";

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
      id: nanoid(),
    });
    guest.children.push(child);
    guest.modifiedDate = new Date().getTime();
    await guest.save();
    res.send(child);
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
        child[k] = req.body[k];
      }
      guest.modifiedDate = new Date().getTime();
      await guest.save();
      res.send(child);
    }
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
      guest.modifiedDate = new Date().getTime();
      await guest.save();
    }
  }
};
