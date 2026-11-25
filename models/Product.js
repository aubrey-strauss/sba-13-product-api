import mongoose from "mongoose";

// the shape every product must follow
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name is required"] },
  description: { type: String, required: [true, "Description is required"] },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: (value) => value > 0,
      message: "Price must be greater than 0",
    },
  },
  category: { type: String, required: [true, "Category is required"] },
  inStock: { type: Boolean, default: true },
  tags: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});
// turn blueprint into model we can save and search
const Product = mongoose.model("Product", productSchema);

export default Product;
