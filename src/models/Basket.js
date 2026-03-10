// src/models/Basket.js
const mongoose = require("mongoose");

const basketItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
});

const basketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [basketItemSchema]
});

module.exports = mongoose.model("Basket", basketSchema);