import mongoose from "mongoose";

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
});

const childSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  age: { type: Number, required: true },
});

const guestSchema = new Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  isComing: { type: Boolean, required: true },
  didReply: { type: Boolean, required: true },
  partner: partnerSchema,
  children: [childSchema],
});

export const PartnerModel = mongoose.model("Partner", partnerSchema);
export const ChildModel = mongoose.model("Child", childSchema);
export const GuestModel = mongoose.model("Guest", guestSchema);
