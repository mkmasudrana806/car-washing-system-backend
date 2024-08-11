import { JwtPayload } from "jsonwebtoken";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";
import AppError from "../../utils/appError";
import { Service } from "../service/service.model";
import { Slot } from "../slot/slot.model";
import httpStatus from "http-status";
import { BOOKING_TYPE } from "./booking.constant";
import mongoose from "mongoose";

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
const createBookingIntoDB = async (user: JwtPayload, payload: TBooking) => {
  // check if user is exists
  const userExists: any = await User.isUserExistsByemail(user?.email);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  payload.customer = userExists._id;

  // check is service is exists
  const service = await Service.findById(payload.service);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found!");
  }

  // check if the slot is exists. if so, then update 'isBooked' status to 'booked'
  const slot = await Slot.findByIdAndUpdate(
    payload.slot,
    { isBooked: BOOKING_TYPE.booked },
    { new: true }
  );
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot is not found!");
  }

  // check if service is belong to that slot
  if (String(slot.service) !== String(payload.service)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this service is not belong to that slot!"
    );
  }

  // booking a new service
  const result = await Booking.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to booked a service");
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
};

// ------------------ get all Bookings from db ----------------
const getAllBookingsFromDB = async () => {
  const result = await Booking.find({})
    .populate("customer")
    .populate("service")
    .populate("slot");
  return result;
};

// ------------------ get user Bookings from db ----------------
const getUserBookingsFromDB = async (email: string) => {
  // check if user exists
  const user: any = await User.isUserExistsByemail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  // find user bookings
  const bookings = await Booking.find({ customer: user._id })
    .populate("customer")
    .populate("service")
    .populate("slot");
  return bookings;
};

// ------------------ get single Booking from db ----------------
const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

// ------------------ delete an Booking from db ----------------
const deleteBookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// ------------------ update an Booking into db ----------------
const updateBookingIntoDB = async (id: string, payload: Partial<TBooking>) => {
  const result = await Booking.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getUserBookingsFromDB,
  getSingleBookingFromDB,
  deleteBookingFromDB,
  updateBookingIntoDB,
};
