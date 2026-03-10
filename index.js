const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB ONCE only
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopdemo")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// Test route
app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
  });
});

// CREATE product
app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || price === undefined || !description) {
      return res.status(400).json({
        ok: false,
        message: "name, price and description are required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      ok: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("POST /products error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

// READ all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json({
      ok: true,
      data: products,
    });
  } catch (error) {
    console.error("GET /products error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

// UPDATE product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    if (!name || price === undefined || !description) {
      return res.status(400).json({
        ok: false,
        message: "name, price and description are required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    res.json({
      ok: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("PUT /products/:id error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

// DELETE product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    res.json({
      ok: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("DELETE /products/:id error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});