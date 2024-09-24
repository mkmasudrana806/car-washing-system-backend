import express from "express";
import { ReviewValidations } from "./review.validation";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequestData";
const router = express.Router();

// create a Review
router.post(
  "/create-review",
  auth("user"),
  validateRequest(ReviewValidations.createAReviewSchema),
  ReviewControllers.createAReview
);

// get all reviews
router.get("/", ReviewControllers.getAllReviews);

// delete a review
router.delete("/:id", auth("user"), ReviewControllers.deleteAReview);

// update a review
router.patch(
  "/:id",
  auth("user"),
  validateRequest(ReviewValidations.updateAReviewSchema),
  ReviewControllers.updateAReview
);

export const ReviewRoutes = router;
