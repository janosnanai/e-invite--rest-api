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

const refreshTokenSchema = new Schema({
  token: { type: String, required: true },
});

export const AdminAuthModel = mongoose.model("Admin", adminAuthSchema);
export const UserAuthModel = mongoose.model("User", userAuthSchema);
export const RefreshTokenModel = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);
