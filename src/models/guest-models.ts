import mongoose from "mongoose";

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  foodGlutenFree: { type: Boolean, required: true },
  foodLactoseFree: { type: Boolean, required: true },
  foodDiabetic: { type: Boolean, required: true },
});

const childSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
  age: { type: Number, required: true },
  foodGlutenFree: { type: Boolean, required: true },
  foodLactoseFree: { type: Boolean, required: true },
  foodDiabetic: { type: Boolean, required: true },
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
  foodGlutenFree: { type: Boolean, required: true },
  foodLactoseFree: { type: Boolean, required: true },
  foodDiabetic: { type: Boolean, required: true },
  partner: partnerSchema,
  children: [childSchema],
  createdDate: { type: Number, required: true },
  modifiedDate: { type: Number, required: true },
});

export const PartnerModel = mongoose.model("Partner", partnerSchema);
export const ChildModel = mongoose.model("Child", childSchema);
export const GuestModel = mongoose.model("Guest", guestSchema);
