import httpStatus from "http-status";
import { TReview } from "./review.interface";
import { Review } from "./review.model";
import { JwtPayload } from "jsonwebtoken";
// import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";
import { REVIEW_ALLOWED_FIELDS_TO_UPDATE } from "./review.constant";
import QueryBuilder from "../../builders/QueryBuilder";
import { Service } from "../service/service.model";
import AppError from "../../utils/appError";
import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";

// -------------- create a review into db --------------
const createAReviewIntoDB = async (userData: JwtPayload, payload: TReview) => {
  // // check if the service is exists
  // const isServiceExists = await Service.findById(payload.serviceId);
  // if (!isServiceExists) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  // }
  // // check if the service belongs to the user
  // const isUserBelongsToOrder = await Order.findOne({
  //   userId: userData.userId,
  //   status: "delivered",
  //   "items.serviceId": payload.serviceId,
  // });
  // if (!isUserBelongsToOrder) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Your are not belong to the service"
  //   );
  // }
  // // throw error if review is already exists
  // const isReviewExists = await Review.findOne({
  //   userId: userData.userId,
  //   serviceId: payload.serviceId,
  // });
  // if (isReviewExists) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Review already exists");
  // }
  // // set userId from jwt payload
  // payload.userId = userData.userId;
  // const result = await Review.create(payload);
  // return result;
};

// -------------- get all reviews by default. also filter by serviceId or serviceId&&userId--------------
const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find({}).populate("userId"),
    query
  ).filter();
  const result = reviewQuery.modelQuery;
  return result;
};

// -------------- delete a review --------------
// also throw error review is not belong to this user
const deleteAReviewIntoDB = async (userId: string, reviewId: string) => {
  // check if review belongs to the user
  const result = await Review.findOneAndDelete({
    _id: reviewId,
    userId,
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Service is not belong to you!");
  }

  return result;
};

// -------------- update a review --------------
const updateAReviewIntoDB = async (
  userId: string,
  reviewId: string,
  payload: TReview
) => {
  const allowedUpdatedData = makeAllowedFieldData<TReview>(
    REVIEW_ALLOWED_FIELDS_TO_UPDATE,
    payload
  );

  // check if the review belongs to the user
  const isReviewExists = await Review.findOne({
    _id: reviewId,
    userId,
  });
  if (!isReviewExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review is not belong to you!");
  }

  //review update not allowed after 7 days
  const currentDate = new Date();
  const createdDate = isReviewExists.createdAt as any;
  // calculate time difference in milliseconds
  const diffInMilliseconds = currentDate.getTime() - createdDate.getTime();
  // calculate days
  const diffInDays = diffInMilliseconds / (1000 * 24 * 60 * 60);
  if (diffInDays > 7) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not edit your review after 7 days"
    );
  }

  const result = await Review.findByIdAndUpdate(reviewId, allowedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const ReviewServices = {
  createAReviewIntoDB,
  getAllReviewsFromDB,
  deleteAReviewIntoDB,
  updateAReviewIntoDB,
};
