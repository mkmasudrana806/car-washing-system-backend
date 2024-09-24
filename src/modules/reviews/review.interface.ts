import { Date, Types } from "mongoose";

export type TReview = {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};
