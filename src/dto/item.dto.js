const { z } = require("zod");

const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  category: z.string().min(1, "Category is required"),
  // images are handled by multer, so not directly in DTO for body validation
});

const updateItemSchema = z.object({
  name: z.string().min(1, "Item name is required").optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  category: z.string().min(1, "Category is required").optional(),
});

module.exports = {
  createItemSchema,
  updateItemSchema,
};

