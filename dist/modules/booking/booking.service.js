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
exports.BookingServices = void 0;
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../utils/appError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("../slot/slot.model");
const http_status_1 = __importDefault(require("http-status"));
const booking_constant_1 = require("./booking.constant");
// ------------------ create Booking into db ----------------
// with transaction
// const createBookingIntoDB = async (user: JwtPayload, payload: TBooking) => {
//   // check if user is exists
//   const userExists: any = await User.isUserExistsByemail(user?.email);
//   if (!userExists) {
//     throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
//   }
//   payload.customer = userExists._id;
//   // check is service is exists
//   const service = await Service.findById(payload.service);
//   if (!service) {
//     throw new AppError(httpStatus.NOT_FOUND, "Service is not found!");
//   }
//   // start session
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // check if the slot is exists. if so, then update 'isBooked' status to 'booked'
//     const slot = await Slot.findByIdAndUpdate(
//       payload.slot,
//       { isBooked: BOOKING_TYPE.booked },
//       { new: true, session }
//     );
//     if (!slot) {
//       throw new AppError(httpStatus.NOT_FOUND, "Slot is not found!");
//     }
//     // check if service is belong to that slot
//     if (String(slot.service) !== String(payload.service)) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "this service is not belong to that slot!"
//       );
//     }
//     // booking a new service
//     const result = await Booking.create([payload], { session });
//     if (!(result.length > 0)) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to booked a service");
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return {
//       customer: userExists,
//       service: service,
//       slot: slot,
//       vehicleType: result[0].vehicleType,
//       vehicleBrand: result[0].vehicleBrand,
//       vehicleModel: result[0].vehicleModel,
//       manufacturingYear: result[0].manufacturingYear,
//       registrationPlate: result[0].registrationPlate,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Faild to booked a service"
//     );
//   }
// };
// without transaction
const createBookingIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user is exists
    const userExists = yield user_model_1.User.isUserExistsByemail(user === null || user === void 0 ? void 0 : user.email);
    if (!userExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    payload.customer = userExists._id;
    // check is service is exists
    const service = yield service_model_1.Service.findById(payload.service);
    if (!service) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found!");
    }
    // check if the slot is exists. if so, then update 'isBooked' status to 'booked'
    const slot = yield slot_model_1.Slot.findByIdAndUpdate(payload.slot, { isBooked: booking_constant_1.BOOKING_TYPE.booked }, { new: true });
    if (!slot) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Slot is not found!");
    }
    // check if service is belong to that slot
    if (String(slot.service) !== String(payload.service)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this service is not belong to that slot!");
    }
    // booking a new service
    const result = yield booking_model_1.Booking.create(payload);
    if (!result) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to booked a service");
    }
    return {
        customer: userExists,
        service: service,
        slot: slot,
        vehicleType: result.vehicleType,
        vehicleBrand: result.vehicleBrand,
        vehicleModel: result.vehicleModel,
        manufacturingYear: result.manufacturingYear,
        registrationPlate: result.registrationPlate,
    };
});
// ------------------ get all Bookings from db ----------------
const getAllBookingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.find({})
        .populate("customer")
        .populate("service")
        .populate("slot");
    return result;
});
// ------------------ get user Bookings from db ----------------
const getUserBookingsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield user_model_1.User.isUserExistsByemail(email);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    // find user bookings
    const bookings = yield booking_model_1.Booking.find({ customer: user._id })
        .populate("customer")
        .populate("service")
        .populate("slot");
    return bookings;
});
// ------------------ get single Booking from db ----------------
const getSingleBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findById(id);
    return result;
});
// ------------------ delete an Booking from db ----------------
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ------------------ update an Booking into db ----------------
const updateBookingIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getUserBookingsFromDB,
    getSingleBookingFromDB,
    deleteBookingFromDB,
    updateBookingIntoDB,
};
