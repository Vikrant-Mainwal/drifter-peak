import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  otp: String,
  otpExpiry: Date,
});

export default mongoose.models.User || mongoose.model("User", userSchema);