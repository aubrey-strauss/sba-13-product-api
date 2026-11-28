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

// GET /api/products: list products
router.get("/", async (req, res) => {
  //It doesn't clash with /:id, because "/" only matches exact path
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query; //pulls category out of the URL's query string

    // FILTER
    const filter = {}; // an empty filter object - build the query dynamically
    if (category) {
      filter.category = category; // only filter by category if one was asked for
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice); // $gte = "greater than or equal to"
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice); // $lte = "less than or equal to"
      }
    }
    if (Number.isNaN(filter.price?.$gte) || Number.isNaN(filter.price?.$lte)) {
      // NaN ("not a number")
      return res
        .status(400)
        .json({ message: "minPrice and maxPrice must be numbers" }); // reject prices that aren't numbers, like ?minPrice=abc
    }

    // FILTER
    let sort = {}; // decide the sort order: 1 = low to high, -1 = high to low
    if (sortBy === "price_asc") {
      sort = { price: 1 };
    } else if (sortBy === "price_desc") {
      sort = { price: -1 };
    } else if (sortBy) {
      return res
        .status(400)
        .json({ message: "sortBy must be price_asc or price_desc " });
    }

    // pagination: turn the text from the URL into whole numbers
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (
      !Number.isInteger(pageNum) ||
      pageNum < 1 ||
      !Number.isInteger(limitNum) ||
      limitNum < 1
    ) {
      return res
        .status(400)
        .json({ message: "page and limit must be whole numbers of 1 or more" });
    }
    const skip = (pageNum - 1) * limitNum;
    const products = await Product.find(filter) //filter, then sort, then skip earlier pages, then take only limit products
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json(products); // respond with an array
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message }); // why 500? there's no id so the only thing that can go wrong is the server
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //send back the product after the update. Without it, Mongoose sends the old version. The spec asks for this one by name
      runValidators: true, //Mongoose skips your schema rules on updates unless you ask. This keeps someone from updating the price to -5
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
export default router;
