import { Schema, model } from "mongoose";
import { IBookingModel, TBooking, TVehicleInfo } from "./booking.interface";
import { VEHICLE_TYPE } from "./booking.constant";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

const vehicleInfoSchema = new Schema<TVehicleInfo>({
  vehicleType: {
    type: String,
    required: true,
    enum: VEHICLE_TYPE,
  },
  vehicleBrand: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  manufacturingYear: { type: Number, required: true },
  registrationPlate: { type: String, required: true },
});

// Booking schema
const bookingSchema = new Schema<TBooking, IBookingModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    service: { type: Schema.Types.ObjectId, required: true, ref: "Service" },
    slot: { type: Schema.Types.ObjectId, required: true, ref: "Slot" },
    vehicleInfo: {
      type: vehicleInfoSchema,
      required: true,
    },
    date: { type: Date, required: true, default: new Date() },
    paymentId: { type: String, required: true, default: "default payment id" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// statics methods for isBookingExistsById
bookingSchema.statics.isBookingExistsById = async function (_id: string) {
  const result = await Booking.findById(_id);
  if (result?.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this booking is already deleted"
    );
  }
  return result;
};
export const Booking = model<TBooking, IBookingModel>("Booking", bookingSchema);
