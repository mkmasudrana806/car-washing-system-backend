"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("./booking.constant");
// Booking schema
const bookingSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    service: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Service" },
    slot: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Slot" },
    vehicleType: {
        type: String,
        required: true,
        enum: booking_constant_1.VEHICLE_TYPE,
    },
    vehicleBrand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    manufacturingYear: { type: Number, required: true },
    registrationPlate: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
