import { JwtPayload } from "jsonwebtoken";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import AppError from "../../utils/appError";
import { Service } from "../service/service.model";
import { Slot } from "../slot/slot.model";
import httpStatus from "http-status";
import { BOOKING_TYPE, bookingsSearchableFields } from "./booking.constant";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import Stripe from "stripe";
import config from "../../app/config";

/**
 * ------------------ create Booking into db ----------------
 *
 * @param user current logged in user
 * @param payload new booking data
 * @validations check if user, service, slot exists. check slot is not booked
 * @validations check if service is belongs to that corresponding slot
 * @returns newly booking data
 */
const createBookingIntoDB = async (user: JwtPayload, payload: TBooking) => {
  // check if user is exists
  const userExists: any = await User.isUserExistsByemail(user?.email);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  payload.user = userExists._id;

  // check is service is exists
  const service = await Service.findById(payload.service);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found!");
  }

  // check if the slot is exists
  const slot = await Slot.findById(payload.slot);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot is not found!");
  }

  // check if the slot is available
  if (slot.isBooked !== BOOKING_TYPE.available) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot is already booked!");
  }

  // check if service is belong to that slot
  if (String(slot.service) !== String(payload.service)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this service is not belong to that slot!"
    );
  }

  // make stripe payment
  const stripe = new Stripe(config.stripe_secret_key as string);
  const line_items = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: String(payload.slot),
        },
        unit_amount: payload.amount * 100,
      },
      quantity: 1,
    },
  ];
  const paymentSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: line_items,
    success_url: "http://localhost:5173/user/purchase-success",
    cancel_url: "http://localhost:5173/user/purchase-faild",
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // make that slot to booked
    const booking = await Slot.findByIdAndUpdate(
      payload.slot,
      { isBooked: "booked" },
      { new: true, session }
    );

    if (booking?.isBooked !== BOOKING_TYPE.booked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Unable to booked this slot!");
    }

    // booking a new service
    const result = await Booking.create([payload], { session });
    if (result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to booked a service");
    }

    await session.commitTransaction();
    await session.endSession();
    return paymentSession.id;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * ------------------ get all Bookings from db ----------------
 *
 * @param query req.query object
 * @features search functionality by customer.name, customer.email, customer.phone, service.name, service.description, booking.vehicleType, booking.vehicleBrand.
 * @features searching, pagination, sorting, field limiting
 * @example sorting: sort=customer.email or sort=vehicleType or sort=-vehicleBrand. negative means descending otherwise ascending order
 * @example fields liming: fields=-customer,service,slot means exclude them, as negative sign. it works nested fields limiting also. like fields=customer.name
 * @returns return all bookings that is not deleted
 */
const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  // as i use aggregation pipeline, that is why i am not use QueryBuilder here.
  // because i want to implement search functionality inside customer, service and slot also.

  // ------------- date filters
  let matchCondition: Partial<{ isDeleted: boolean; date: object }> = {
    isDeleted: false,
  };
  if (query?.date) {
    matchCondition.date = { $gte: new Date(query?.date as string) };
  }

  // ------------- searching
  const searchRegex = new RegExp(query.searchTerm as string, "i");

  //----------- pagination
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;

  // ------------ sort based on query parameter
  let sort = (query.sort as string) || "-createdAt";
  let sortField: string = "createdAt"; // by default
  let sortOrder: 1 | -1 = -1; // descending order by default

  if (sort.startsWith("-")) {
    sortField = sort.substring(1); // discard "-" part. ex: "-email". take "email" part
    sortOrder = -1; // descending order
  } else {
    sortField = sort;
    sortOrder = 1;
  }

  // ------------ fields limitng
  let projectFields: Record<string, 0 | 1> = {};
  if (query.fields) {
    const isExclusion = (query.fields as string).startsWith("-");
    const fields = (query.fields as string).replace("-", "").split(",");

    // --------- make project fields object
    fields.forEach((field) => {
      projectFields[field.trim()] = isExclusion ? 0 : 1;
    });
  } else {
    projectFields = {
      __v: 0,
    };
  }

  // aggregation pipeline
  const result = await Booking.aggregate([
    // filter out those bookings is deleted true
    {
      $match: matchCondition,
    },
    {
      $lookup: {
        from: "users", // Collection name where user are stored
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" }, // convert that user array to object
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $lookup: {
        from: "slots",
        localField: "slot",
        foreignField: "_id",
        as: "slot",
      },
    },
    { $unwind: "$slot" },
    // partial searching
    {
      $match: {
        $or: bookingsSearchableFields.map((field) => ({
          [field]: searchRegex,
        })),
      },
    },
    // skip document for pagination
    {
      $skip: skip,
    },
    // limiting
    {
      $limit: limit,
    },
    // sort the document
    {
      $sort: { [sortField]: sortOrder },
    },
    // fields limiting
    {
      $project: projectFields,
    },
  ]);

  return result;
};

/**
 * ------------------ get user Bookings from db ----------------
 *
 * @param email email of currently logged in user
 * @param query req.query object containing query parameters
 * @validations check if the user is exists by email address
 * @features search functionality by customer.name, customer.email, customer.phone, service.name, service.description, booking.vehicleType, booking.vehicleBrand.
 * @features searching, pagination, sorting, field limiting
 * @example sorting: sort=customer.email or sort=vehicleType or sort=-vehicleBrand. negative means descending otherwise ascending order
 * @example fields liming: fields=-customer,service,slot means exclude them, as negative sign. it works nested fields limiting also. like fields=customer.name
 * @returns return user Bookings those are not deleted
 */
const getUserBookingsFromDB = async (
  email: string,
  query: Record<string, unknown>
) => {
  // check if user exists
  const user: any = await User.isUserExistsByemail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  // search funcitonality
  const searchRegex = new RegExp(query.searchTerm as string, "i");

  // pagination
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;

  // sort based on query parameter
  let sort = (query.sort as string) || "-createdAt";
  let sortField: string = "createdAt"; // by default
  let sortOrder: 1 | -1 = -1; // descending order by default

  if (sort.startsWith("-")) {
    sortField = sort.substring(1); // discard "-" part. ex: "-email". take "email" part
    sortOrder = -1; // descending order
  } else {
    sortField = sort;
    sortOrder = 1;
  }

  // fields limitng
  let projectFields: Record<string, 0 | 1> = {};
  if (query.fields) {
    const isExclusion = (query.fields as string).startsWith("-");
    const fields = (query.fields as string).replace("-", "").split(",");

    // make project fields object
    fields.forEach((field) => {
      projectFields[field.trim()] = isExclusion ? 0 : 1;
    });
  } else {
    projectFields = {
      __v: 0,
    };
  }

  // aggregation piepeline
  const result = await Booking.aggregate([
    // filter out those bookings is deleted true
    {
      $match: {
        customer: user._id,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "users", // Collection name where customers are stored
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" }, // convert that customers array to object
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $lookup: {
        from: "slots",
        localField: "slot",
        foreignField: "_id",
        as: "slot",
      },
    },
    { $unwind: "$slot" },
    // partial searching.
    {
      $match: {
        $or: bookingsSearchableFields.map((field) => ({
          [field]: searchRegex,
        })),
      },
      // similar to
      // $or: [
      //   { "customer.name": searchRegex },
      //   { "customer.email": searchRegex },
      //   { "customer.phone": searchRegex },
      //   { "service.name": searchRegex },
      //   { "slot.date": searchRegex },
      //   { vehicleType: searchRegex },
      //   { vehicleBrand: searchRegex },
      // ]
    },
    // skip document for pagination
    {
      $skip: skip,
    },
    // limiting
    {
      $limit: limit,
    },
    // sort the document
    {
      $sort: { [sortField]: sortOrder },
    },
    // fields limiting
    {
      $project: projectFields,
    },
  ]);

  return result;
};

/**
 * ------------------ get single Booking from db ----------------
 *
 * @param id id provided by the mongodb
 * @returns retunr single booking information with populated fields
 */
const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id)
    .populate("customer")
    .populate("service")
    .populate("slot");
  return result;
};

/**
 * ------------------ delete an Booking from db ----------------
 *
 * @param id id provided by the mongodb
 * @features release the booked slot belongs to this booking
 * @returns return a deleted booking
 */
const deleteBookingFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // transaction-1
    // delete the booking info
    const result = await Booking.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!result) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Booking information is not found!"
      );
    }

    // transaction-2
    // release the booked slot to available
    const releasedSlot = await Slot.findByIdAndUpdate(
      result?.slot,
      {
        isBooked: "available",
      },
      { new: true, session }
    );

    if (!releasedSlot || releasedSlot.isBooked !== BOOKING_TYPE.available) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Unable to release slot booked to available"
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Unable to delete a booking information"
    );
  }
};

/**
 * ------------------ update an Booking into db ----------------
 *
 * @param id id provided by the mongodb
 * @param payload updated booking information
 * @validations check if the booking exists and service, slot exists if provided to update
 * @validations check if slot is belong to the service
 * @validations release previous slot and booked new slot if slot is provided to update
 * @returns return the updated booking information
 */
const updateBookingIntoDB = async (id: string, payload: Partial<TBooking>) => {
  // check if the booking is exists
  const oldBooking: any = await Booking.findOne({ _id: id, isDeleted: false })
    .populate("service")
    .populate("slot")
    .select("service slot");

  if (!oldBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "booking data is not found!");
  }

  // check both service, slot exists, if both service and slot are provided to update
  let newService = null;
  let newSlot = null;
  if (payload.service && payload.slot) {
    newService = await Service.findOne({
      _id: payload?.service,
      isDeleted: false,
    });
    if (!newService) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Service is not found or already deleted!"
      );
    }

    newSlot = await Slot.findOne({
      _id: payload?.slot,
      isBooked: BOOKING_TYPE.available,
    });
    if (!newSlot) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Slot is not found or already booked!"
      );
    }

    // check if service is belong to that slot
    if (String(newSlot.service) !== String(newService._id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "this slot is not belong to this service"
      );
    }
  }

  // check service is exists, if only service provided to update
  if (payload?.service && !payload.slot) {
    newService = await Service.findOne({
      _id: payload?.service,
      isDeleted: false,
    });
    if (!newService) {
      throw new AppError(httpStatus.NOT_FOUND, "Service is not found!");
    }

    if (String(payload?.service) !== String(oldBooking?.slot?.service)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "this service is not belong to old slot"
      );
    }
  }

  // check slot is exists, if only slot provided to update
  if (payload?.slot && !payload.service) {
    newSlot = await Slot.findOne({
      _id: payload?.slot,
      isBooked: BOOKING_TYPE.available,
    });

    if (!newSlot) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Slot is not found or already booked!"
      );
    }
    // check slot is belong to old service,
    if (String(newSlot.service) !== String(oldBooking?.service?._id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "this slot is not belong to old service"
      );
    }
  }

  // allowed fields to update and updated payload
  const updatedBookingData: Record<string, unknown> = {};
  const allowedFields: (keyof TBooking)[] = ["service", "slot", "vehicleInfo"];
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updatedBookingData[field] = payload[field];
    }
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // make new slot to booked, if slot is changed
    if (payload?.slot) {
      // make new slot to booked
      const bookedSlot = await Slot.findByIdAndUpdate(
        payload.slot,
        { isBooked: "booked" },
        { new: true, session }
      );
      // make old slot to available
      const availableSlot = await Slot.findByIdAndUpdate(
        oldBooking.slot._id,
        {
          isBooked: "available",
        },
        { new: true, session }
      );

      if (!bookedSlot || !availableSlot) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Unable to release old slot or make new slot to available"
        );
      }
    }

    const result = await Booking.findByIdAndUpdate(id, updatedBookingData, {
      new: true,
      session,
    })
      .populate("customer")
      .populate("service")
      .populate("slot");

    if (!result) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Unable to update booking information"
      );
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to update booking information"
    );
  }
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getUserBookingsFromDB,
  getSingleBookingFromDB,
  deleteBookingFromDB,
  updateBookingIntoDB,
};
