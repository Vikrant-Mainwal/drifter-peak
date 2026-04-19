import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: String,
  size: String,
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [cartItemSchema],
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);