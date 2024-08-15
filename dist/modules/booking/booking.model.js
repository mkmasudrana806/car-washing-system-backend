"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("./booking.constant");
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
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
// statics methods for isBookingExistsById
bookingSchema.statics.isBookingExistsById = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.Booking.findById(_id);
        if (result === null || result === void 0 ? void 0 : result.isDeleted) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this booking is already deleted");
        }
        return result;
    });
};
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
