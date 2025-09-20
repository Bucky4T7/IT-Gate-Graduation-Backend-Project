const Item = require("../models/item.model");

const createItem = async (itemData, imageUrls) => {
  const item = new Item({ ...itemData, images: imageUrls });
  await item.save();
  return item;
};

const getAllItems = async (filters, pagination) => {
  const { search, category, minPrice, maxPrice } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

  const query = { isDeleted: false };
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const items = await Item.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Item.countDocuments(query);

  return {
    items,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const getItemById = async (itemId) => {
  const item = await Item.findOne({ _id: itemId, isDeleted: false });
  if (!item) {
    throw new Error("Item not found");
  }
  return item;
};

const updateItem = async (itemId, updateData, imageUrls) => {
  const item = await Item.findOne({ _id: itemId, isDeleted: false });
  if (!item) {
    throw new Error("Item not found");
  }

  // Prevent setting stock below 0
  if (updateData.stock !== undefined && updateData.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  Object.assign(item, updateData);
  if (imageUrls && imageUrls.length > 0) {
    item.images = imageUrls;
  }

  await item.save();
  return item;
};

const softDeleteItem = async (itemId) => {
  const item = await Item.findOne({ _id: itemId, isDeleted: false });
  if (!item) {
    throw new Error("Item not found");
  }
  item.isDeleted = true;
  await item.save();
  return { message: "Item soft-deleted successfully" };
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  softDeleteItem,
};

