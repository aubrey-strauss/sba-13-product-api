import express from "express";
import Product from "../models/Product.js";
// a mini app that holds all the /api/products routes
const router = express.Router();

// POST /api/products: create a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product); // 201 means "Created"
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
