import mongoose from "mongoose";

// the shape every product must follow
const productSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  category: { type: String },
  inStock: { type: Boolean },
  tags: { type: [String] },
  createdAt: { type: Date },
});
