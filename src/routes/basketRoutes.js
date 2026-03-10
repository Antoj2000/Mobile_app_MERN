// src/routes/basketRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBasket,
  addToBasket,
  removeFromBasket,
  updateBasketQuantity
} = require("../controllers/basketController");

router.get("/", getBasket);
router.post("/add", addToBasket);
router.delete("/remove", removeFromBasket);
router.put("/update", updateBasketQuantity);

module.exports = router;