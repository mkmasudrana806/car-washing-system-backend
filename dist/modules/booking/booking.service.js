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
const appError_1 = __importDefault(require("../../utils/appError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("../slot/slot.model");
const http_status_1 = __importDefault(require("http-status"));
const booking_constant_1 = require("./booking.constant");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../app/config"));
/**
 * ------------------ create Booking into db ----------------
 *
 * @param user current logged in user
 * @param payload new booking data
 * @validations check if user, service, slot exists. check slot is not booked
 * @validations check if service is belongs to that corresponding slot
 * @returns newly booking data
 */
const createBookingIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user is exists
    const userExists = yield user_model_1.User.isUserExistsByemail(user === null || user === void 0 ? void 0 : user.email);
    if (!userExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    payload.user = userExists._id;
    // check is service is exists
    const service = yield service_model_1.Service.findById(payload.service);
    if (!service) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found!");
    }
    // check if the slot is exists
    const slot = yield slot_model_1.Slot.findById(payload.slot);
    if (!slot) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Slot is not found!");
    }
    // check if the slot is available
    if (slot.isBooked !== booking_constant_1.BOOKING_TYPE.available) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Slot is already booked!");
    }
    // check if service is belong to that slot
    if (String(slot.service) !== String(payload.service)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this service is not belong to that slot!");
    }
    // make stripe payment
    const stripe = new stripe_1.default(config_1.default.stripe_secret_key);
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
    const paymentSession = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: line_items,
        success_url: "http://localhost:5173/user/purchase-success",
        cancel_url: "http://localhost:5173/user/purchase-faild",
    });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // make that slot to booked
        const booking = yield slot_model_1.Slot.findByIdAndUpdate(payload.slot, { isBooked: "booked" }, { new: true, session });
        if ((booking === null || booking === void 0 ? void 0 : booking.isBooked) !== booking_constant_1.BOOKING_TYPE.booked) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Unable to booked this slot!");
        }
        // booking a new service
        const result = yield booking_model_1.Booking.create([payload], { session });
        if (result.length === 0) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to booked a service");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return paymentSession.id;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
    }
});
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
const getAllBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // as i use aggregation pipeline, that is why i am not use QueryBuilder here.
    // because i want to implement search functionality inside customer, service and slot also.
    // searching
    const searchRegex = new RegExp(query.searchTerm, "i");
    // pagination
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    // sort based on query parameter
    let sort = query.sort || "-createdAt";
    let sortField = "createdAt"; // by default
    let sortOrder = -1; // descending order by default
    if (sort.startsWith("-")) {
        sortField = sort.substring(1); // discard "-" part. ex: "-email". take "email" part
        sortOrder = -1; // descending order
    }
    else {
        sortField = sort;
        sortOrder = 1;
    }
    // fields limitng
    let projectFields = {};
    if (query.fields) {
        const isExclusion = query.fields.startsWith("-");
        const fields = query.fields.replace("-", "").split(",");
        // make project fields object
        fields.forEach((field) => {
            projectFields[field.trim()] = isExclusion ? 0 : 1;
        });
    }
    else {
        projectFields = {
            __v: 0,
        };
    }
    // aggregation pipeline
    const result = yield booking_model_1.Booking.aggregate([
        // filter out those bookings is deleted true
        {
            $match: {
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
        // partial searching
        {
            $match: {
                $or: booking_constant_1.bookingsSearchableFields.map((field) => ({
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
});
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
const getUserBookingsFromDB = (email, query) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield user_model_1.User.isUserExistsByemail(email);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    // search funcitonality
    const searchRegex = new RegExp(query.searchTerm, "i");
    // pagination
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    // sort based on query parameter
    let sort = query.sort || "-createdAt";
    let sortField = "createdAt"; // by default
    let sortOrder = -1; // descending order by default
    if (sort.startsWith("-")) {
        sortField = sort.substring(1); // discard "-" part. ex: "-email". take "email" part
        sortOrder = -1; // descending order
    }
    else {
        sortField = sort;
        sortOrder = 1;
    }
    // fields limitng
    let projectFields = {};
    if (query.fields) {
        const isExclusion = query.fields.startsWith("-");
        const fields = query.fields.replace("-", "").split(",");
        // make project fields object
        fields.forEach((field) => {
            projectFields[field.trim()] = isExclusion ? 0 : 1;
        });
    }
    else {
        projectFields = {
            __v: 0,
        };
    }
    // aggregation piepeline
    const result = yield booking_model_1.Booking.aggregate([
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
                $or: booking_constant_1.bookingsSearchableFields.map((field) => ({
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
});
/**
 * ------------------ get single Booking from db ----------------
 *
 * @param id id provided by the mongodb
 * @returns retunr single booking information with populated fields
 */
const getSingleBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findById(id)
        .populate("customer")
        .populate("service")
        .populate("slot");
    return result;
});
/**
 * ------------------ delete an Booking from db ----------------
 *
 * @param id id provided by the mongodb
 * @features release the booked slot belongs to this booking
 * @returns return a deleted booking
 */
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // transaction-1
        // delete the booking info
        const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!result) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Booking information is not found!");
        }
        // transaction-2
        // release the booked slot to available
        const releasedSlot = yield slot_model_1.Slot.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.slot, {
            isBooked: "available",
        }, { new: true, session });
        if (!releasedSlot || releasedSlot.isBooked !== booking_constant_1.BOOKING_TYPE.available) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Unable to release slot booked to available");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Unable to delete a booking information");
    }
});
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
const updateBookingIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // check if the booking is exists
    const oldBooking = yield booking_model_1.Booking.findOne({ _id: id, isDeleted: false })
        .populate("service")
        .populate("slot")
        .select("service slot");
    if (!oldBooking) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "booking data is not found!");
    }
    // check both service, slot exists, if both service and slot are provided to update
    let newService = null;
    let newSlot = null;
    if (payload.service && payload.slot) {
        newService = yield service_model_1.Service.findOne({
            _id: payload === null || payload === void 0 ? void 0 : payload.service,
            isDeleted: false,
        });
        if (!newService) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found or already deleted!");
        }
        newSlot = yield slot_model_1.Slot.findOne({
            _id: payload === null || payload === void 0 ? void 0 : payload.slot,
            isBooked: booking_constant_1.BOOKING_TYPE.available,
        });
        if (!newSlot) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Slot is not found or already booked!");
        }
        // check if service is belong to that slot
        if (String(newSlot.service) !== String(newService._id)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this slot is not belong to this service");
        }
    }
    // check service is exists, if only service provided to update
    if ((payload === null || payload === void 0 ? void 0 : payload.service) && !payload.slot) {
        newService = yield service_model_1.Service.findOne({
            _id: payload === null || payload === void 0 ? void 0 : payload.service,
            isDeleted: false,
        });
        if (!newService) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found!");
        }
        if (String(payload === null || payload === void 0 ? void 0 : payload.service) !== String((_a = oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.slot) === null || _a === void 0 ? void 0 : _a.service)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this service is not belong to old slot");
        }
    }
    // check slot is exists, if only slot provided to update
    if ((payload === null || payload === void 0 ? void 0 : payload.slot) && !payload.service) {
        newSlot = yield slot_model_1.Slot.findOne({
            _id: payload === null || payload === void 0 ? void 0 : payload.slot,
            isBooked: booking_constant_1.BOOKING_TYPE.available,
        });
        if (!newSlot) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Slot is not found or already booked!");
        }
        // check slot is belong to old service,
        if (String(newSlot.service) !== String((_b = oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.service) === null || _b === void 0 ? void 0 : _b._id)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this slot is not belong to old service");
        }
    }
    // allowed fields to update and updated payload
    const updatedBookingData = {};
    const allowedFields = ["service", "slot", "vehicleInfo"];
    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            updatedBookingData[field] = payload[field];
        }
    });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // make new slot to booked, if slot is changed
        if (payload === null || payload === void 0 ? void 0 : payload.slot) {
            // make new slot to booked
            const bookedSlot = yield slot_model_1.Slot.findByIdAndUpdate(payload.slot, { isBooked: "booked" }, { new: true, session });
            // make old slot to available
            const availableSlot = yield slot_model_1.Slot.findByIdAndUpdate(oldBooking.slot._id, {
                isBooked: "available",
            }, { new: true, session });
            if (!bookedSlot || !availableSlot) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, "Unable to release old slot or make new slot to available");
            }
        }
        const result = yield booking_model_1.Booking.findByIdAndUpdate(id, updatedBookingData, {
            new: true,
            session,
        })
            .populate("customer")
            .populate("service")
            .populate("slot");
        if (!result) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "Unable to update booking information");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Unable to update booking information");
    }
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getUserBookingsFromDB,
    getSingleBookingFromDB,
    deleteBookingFromDB,
    updateBookingIntoDB,
};
