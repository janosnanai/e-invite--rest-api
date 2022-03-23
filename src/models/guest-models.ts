import mongoose from "mongoose";

const Schema = mongoose.Schema;

const nameSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: false },
});

const contactSchema = new Schema({
  email: { type: String, required: false },
  phone: { type: String, required: false },
});

const partnerSchema = new Schema({
  name: nameSchema,
  isComing: { type: Boolean, required: true },
});
const childSchema = new Schema({
  name: nameSchema,
  age: { type: Number, required: true },
});

const guestSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: nameSchema,
  contact: contactSchema,
  isComing: { type: Boolean, required: true },
  didReply: { type: Boolean, required: true },
  partner: partnerSchema,
  children: [childSchema],
});

export default mongoose.model("Guest", guestSchema);
