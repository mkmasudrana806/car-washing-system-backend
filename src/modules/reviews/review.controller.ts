import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";
import catchAsync from "../../utils/catchAsync";

// ------------------- create a review -------------------
const createAReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createAReviewIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review posted is successfull",
    data: result,
  });
});

// --------------- get all reviews -------------------
const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Reviews retrieved successfull",
    data: result,
  });
});

// ------------------- delete a review -------------------
const deleteAReview = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const reviewId = req.params?.id;
  const result = await ReviewServices.deleteAReviewIntoDB(userId, reviewId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfull",
    data: result,
  });
});

// ------------------- update a review -------------------
const updateAReview = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const reviewId = req.params?.id;
  const result = await ReviewServices.updateAReviewIntoDB(
    userId,
    reviewId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfull",
    data: result,
  });
});

export const ReviewControllers = {
  createAReview,
  getAllReviews,
  deleteAReview,
  updateAReview,
};
