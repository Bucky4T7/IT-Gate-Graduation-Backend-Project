const { z } = require("zod");

const addItemToWishlistSchema = z.object({
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID"),
});

module.exports = {
  addItemToWishlistSchema,
};

