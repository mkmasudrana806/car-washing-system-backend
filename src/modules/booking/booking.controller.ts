import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { BookingServices } from "./booking.service";

// ------------------ create a Booking ------------------
const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingIntoDB(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking successfully",
    data: result,
  });
});

// ------------------ get all Bookings ------------------
const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All bookings retrieved successfully",
    data: result,
  });
});

// ------------------ get user Bookings ------------------
const getUserBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getUserBookingsFromDB(req.user?.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User bookings retrieved successfully",
    data: result,
  });
});

// ------------------ get single Booking ------------------
const getSingleBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.getSingleBookingFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is retrived successfully",
    data: result,
  });
});

// ------------------ delete an Booking ------------------
const deleteBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.deleteBookingFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is deleted successfully",
    data: result,
  });
});

// ------------------ update an Booking ------------------
const updateBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.updateBookingIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is updated successfully",
    data: result,
  });
});

// export all Bookings controllers
export const BookingControllers = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  deleteBooking,
  updateBooking,
};
