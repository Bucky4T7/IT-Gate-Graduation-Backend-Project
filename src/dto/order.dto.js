const { z } = require("zod");

const createOrderItemSchema = z.object({
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.number().positive("Price must be a positive number"),
});

const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, "Order must contain at least one item"),
  address: z.string().min(1, "Shipping address is required"),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], "Invalid order status"),
});

const updateOrderPaymentStatusSchema = z.object({
  paymentStatus: z.enum(["Pending", "Paid", "Failed"], "Invalid payment status"),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  updateOrderPaymentStatusSchema,
};

