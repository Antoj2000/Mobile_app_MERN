// src/controllers/basketController.js
const Basket = require("../models/Basket");

async function getOrCreateBasket() {
  let basket = await Basket.findOne();

  if (!basket) {
    basket = await Basket.create({ items: [] });
  }

  return basket;
}

async function getBasket(req, res) {
  try {
    const basket = await getOrCreateBasket();
    const populatedBasket = await Basket.findById(basket._id).populate("items.product");

    res.json(populatedBasket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addToBasket(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const basket = await getOrCreateBasket();

    const existingItem = basket.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      basket.items.push({
        product: productId,
        quantity
      });
    }

    await basket.save();
    const populatedBasket = await Basket.findById(basket._id).populate("items.product");

    res.status(200).json(populatedBasket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function removeFromBasket(req, res) {
  try {
    const { productId } = req.body;
    const basket = await Basket.findOne();

    if (!basket) {
      return res.status(404).json({ error: "Basket not found" });
    }

    basket.items = basket.items.filter(
      (item) => item.product.toString() !== productId
    );

    await basket.save();
    const populatedBasket = await Basket.findById(basket._id).populate("items.product");

    res.json(populatedBasket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateBasketQuantity(req, res) {
  try {
    const { productId, quantity } = req.body;
    const basket = await Basket.findOne();

    if (!basket) {
      return res.status(404).json({ error: "Basket not found" });
    }

    const item = basket.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found in basket" });
    }

    if (quantity <= 0) {
      basket.items = basket.items.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await basket.save();
    const populatedBasket = await Basket.findById(basket._id).populate("items.product");

    res.json(populatedBasket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getBasket,
  addToBasket,
  removeFromBasket,
  updateBasketQuantity
};