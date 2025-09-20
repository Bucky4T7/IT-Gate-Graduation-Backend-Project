const Order = require("../models/order.model");
const Item = require("../models/item.model");

const createOrder = async (userId, orderData) => {
  const { items, address } = orderData;

  // Calculate total price and validate item stock
  let totalPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Item.findById(item.itemId);
    if (!product || product.isDeleted) {
      throw new Error(`Item with ID ${item.itemId} not found or is deleted`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for item ${product.name}. Available: ${product.stock}`);
    }
    totalPrice += product.price * item.quantity;
    orderItems.push({ itemId: product._id, quantity: item.quantity, price: product.price });

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order({
    userId,
    items: orderItems,
    totalPrice,
    address,
  });

  await order.save();
  return order;
};

const getMyOrders = async (userId, filters, pagination) => {
  const { status } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

  const query = { userId };
  if (status) {
    query.status = status;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const orders = await Order.find(query)
    .populate("items.itemId", "name price images")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Order.countDocuments(query);

  return {
    orders,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId }).populate("items.itemId", "name price images");
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== "Pending") {
    throw new Error("Only pending orders can be cancelled");
  }

  order.status = "Cancelled";
  await order.save();

  // Restore stock for cancelled items
  for (const item of order.items) {
    await Item.findByIdAndUpdate(item.itemId, { $inc: { stock: item.quantity } });
  }

  return { message: "Order cancelled successfully" };
};

const getAllOrders = async (filters, pagination) => {
  const { status, paymentStatus, userId } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }
  if (userId) {
    query.userId = userId;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const orders = await Order.find(query)
    .populate("userId", "name email")
    .populate("items.itemId", "name price images")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Order.countDocuments(query);

  return {
    orders,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = newStatus;
  await order.save();
  return { message: `Order status updated to ${newStatus}` };
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};

