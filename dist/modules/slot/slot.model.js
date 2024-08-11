"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("../booking/booking.constant");
// slot schema
const slotSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Service" },
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
            booking_constant_1.BOOKING_TYPE.available,
            booking_constant_1.BOOKING_TYPE.booked,
            booking_constant_1.BOOKING_TYPE.cancelled,
        ],
        default: "available",
    },
}, {
    timestamps: true,
});
exports.Slot = (0, mongoose_1.model)("Slot", slotSchema);
