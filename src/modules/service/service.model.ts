import { Schema, model } from "mongoose";
import { IServiceModel, TService } from "./service.interface";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

// service schema
const serviceSchema = new Schema<TService, IServiceModel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// isServiceExists statics methods
serviceSchema.statics.isServicExistsById = async function (_id: string) {
  const result = await Service.findById(_id);
  if (result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Service is already deleted");
  }

  return result;
};

export const Service = model<TService, IServiceModel>("Service", serviceSchema);
