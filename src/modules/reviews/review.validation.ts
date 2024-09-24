import { Types } from "mongoose";
import { z } from "zod";

// create a review schema
const createAReviewSchema = z.object({
  body: z.object({
    serviceId: z
      .string({ required_error: "Service id is required" })
      .refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid serviceId",
      }),
    rating: z
      .number()
      .min(1, "Rating should not be less than 1")
      .max(5, "Rating should not be greater than 5"),
    comment: z.string().optional(),
  }),
});

// update a review schema
const updateAReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, "Rating should not be less than 1")
      .max(5, "Rating should not be greater than 5")
      .optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidations = {
  createAReviewSchema,
  updateAReviewSchema,
};
