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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    quote: { type: String, required: true },
  },
  { timestamps: true }
);

const QuoteEntry = mongoose.model("QuoteEntry", quoteSchema);

app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
  });
});

app.post("/api/quotes", async (req, res) => {
  try {
    const { text, quote } = req.body;

    if (!text || !quote) {
      return res.status(400).json({
        ok: false,
        message: "text and quote are required",
      });
    }

    const newEntry = new QuoteEntry({ text, quote });
    await newEntry.save();

    res.status(201).json({
      ok: true,
      message: "Quote saved successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("POST /api/quotes error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.get("/api/quotes", async (req, res) => {
  try {
    const quotes = await QuoteEntry.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: quotes,
    });
  } catch (error) {
    console.error("GET /api/quotes error:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});