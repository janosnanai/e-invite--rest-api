import mongoose from "mongoose";

const Schema = mongoose.Schema;

const guestSchema = new Schema({
  id: String,
  name: { firstName: String, lastName: String, nickName: String },
  contact: { email: String, phone: String },
  isComing: Boolean,
  didReply: Boolean,
  accompaniedBy: [{
    name: { firstName: String, lastName: String, nickName: String },
    isChild: Boolean,
    age: Number,
  }],
});

export default mongoose.model("Guest", guestSchema);
