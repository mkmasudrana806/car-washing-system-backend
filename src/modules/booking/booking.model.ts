import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";
import { VEHICLE_TYPE } from "./booking.constant";

// Booking schema
const bookingSchema = new Schema<TBooking>(
  {
    customer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    service: { type: Schema.Types.ObjectId, required: true, ref: "Service" },
    slot: { type: Schema.Types.ObjectId, required: true, ref: "Slot" },
    vehicleType: {
      type: String,
      required: true,
      enum: VEHICLE_TYPE,
    },
    vehicleBrand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    manufacturingYear: { type: Number, required: true },
    registrationPlate: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
