const { z } = require("zod");

const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").optional(),
  comment: z.string().optional(),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};

