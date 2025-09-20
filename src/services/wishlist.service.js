const Wishlist = require("../models/wishlist.model");
const Item = require("../models/item.model");

const getMyWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId }).populate("items", "name price images");
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }
  return wishlist;
};

const addItemToWishlist = async (userId, itemId) => {
  const item = await Item.findById(itemId);
  if (!item || item.isDeleted) {
    throw new Error("Item not found");
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }

  if (wishlist.items.includes(itemId)) {
    throw new Error("Item already in wishlist");
  }

  wishlist.items.push(itemId);
  await wishlist.save();
  return wishlist.populate("items", "name price images");
};

const removeItemFromWishlist = async (userId, itemId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  const initialLength = wishlist.items.length;
  wishlist.items = wishlist.items.filter(item => item.toString() !== itemId);

  if (wishlist.items.length === initialLength) {
    throw new Error("Item not found in wishlist");
  }

  await wishlist.save();
  return { message: "Item removed from wishlist successfully" };
};

module.exports = {
  getMyWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
};

