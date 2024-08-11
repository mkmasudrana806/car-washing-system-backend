import { Schema, model } from "mongoose";
import { TSlot } from "./slot.interface";
import { BOOKING_TYPE } from "../booking/booking.constant";

// slot schema
const slotSchema = new Schema<TSlot>(
  {
    service: { type: Schema.Types.ObjectId, required: true, ref: "Service" },
    date: { type: String, required: true },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

    isBooked: {
      type: String,
      enum: [
        BOOKING_TYPE.available,
        BOOKING_TYPE.booked,
        BOOKING_TYPE.cancelled,
      ],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export const Slot = model<TSlot>("Slot", slotSchema);
