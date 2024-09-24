import { TReview } from "./review.interface";

export const REVIEW_ALLOWED_FIELDS_TO_UPDATE: (keyof TReview)[] = [
  "rating",
  "comment",
];
