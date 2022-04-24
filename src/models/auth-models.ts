import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminAuthSchema = new Schema({
  adminId: { type: String, required: true },
  adminPass: { type: String, required: true },
});

const userAuthSchema = new Schema({
  voucherId: { type: String, required: true },
  voucherPass: { type: String, required: true },
  guest: { type: mongoose.Types.ObjectId, required: true, ref: "Guest" },
});

export const AdminAuthModel = mongoose.model("Admin", adminAuthSchema);
export const UserAuthModel = mongoose.model("User", userAuthSchema);
