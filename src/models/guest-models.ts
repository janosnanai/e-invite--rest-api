import mongoose from "mongoose";

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  specialDiet: { type: [String], required: false },
});

const childSchema = new Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  age: { type: Number, required: true },
  specialDiet: { type: [String], required: false },
});

const guestSchema = new Schema({
  voucherId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  email: { type: String, sparse: true, unique: true },
  phone: { type: String, required: false },
  isComing: { type: Boolean, required: true },
  didReply: { type: Boolean, required: true },
  specialDiet: { type: [String], required: false },
  partner: partnerSchema,
  children: [childSchema],
  createdDate: { type: Date, required: true },
  modifiedDate: { type: Date, required: true },
});

export const PartnerModel = mongoose.model("Partner", partnerSchema);
export const ChildModel = mongoose.model("Child", childSchema);
export const GuestModel = mongoose.model("Guest", guestSchema);
