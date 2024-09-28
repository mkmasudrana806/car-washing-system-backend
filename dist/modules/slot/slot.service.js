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
exports.SlotServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("./slot.model");
const slot_utils_1 = require("./slot.utils");
const booking_constant_1 = require("../booking/booking.constant");
/**
 * ------------------ create Slot into db ----------------
 *
 * @param payload data for creating a new slot
 * @validation slots for same service, two times not possible for same date
 * @validation slots for different service, overlap is not possible for the same date
 * @returns newly created all slots
 *
 */
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if service is exists
    const service = yield service_model_1.Service.isServicExistsById(String(payload.service));
    if (!service) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    // slots for same service not allowed at the same date
    const isSameDateExistsForService = yield slot_model_1.Slot.findOne({
        service: payload.service,
        date: payload.date,
    });
    if (isSameDateExistsForService) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "slots for same service not allowed at the same date");
    }
    // check if the new service's slots has time conflict with the existing slots for the same date
    const isConflict = yield (0, slot_utils_1.isSlotConflict)(payload);
    if (isConflict) {
        throw new appError_1.default(http_status_1.default.CONFLICT, `Time confliction for these slots: ${isConflict} `);
    }
    // convert start and end time to minutes for new slots
    const newStartTime = (0, slot_utils_1.timeToMinutes)(payload.startTime);
    const newEndTime = (0, slot_utils_1.timeToMinutes)(payload.endTime);
    // calculate start and end time difference
    const totalMinutes = newEndTime - newStartTime;
    if (totalMinutes < Number(service === null || service === void 0 ? void 0 : service.duration)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Service duration is large than start and end time difference");
    }
    // calculate no of slots
    const slots = Math.floor(totalMinutes / Number(service === null || service === void 0 ? void 0 : service.duration));
    // make new slots array to insert into database
    const newSlots = [];
    let currentStartTime = newStartTime;
    for (let i = 0; i < slots; i++) {
        const slotStartTime = (0, slot_utils_1.minuteToTime)(currentStartTime);
        const slotEndTime = (0, slot_utils_1.minuteToTime)(currentStartTime + Number(service === null || service === void 0 ? void 0 : service.duration));
        newSlots.push({
            service: payload === null || payload === void 0 ? void 0 : payload.service,
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            startTime: slotStartTime,
            endTime: slotEndTime,
        });
        currentStartTime += Number(service === null || service === void 0 ? void 0 : service.duration);
    }
    const result = yield slot_model_1.Slot.insertMany(newSlots);
    return result;
});
/**
 * ------------------ get all Slots from db ----------------
 *
 * @returns all slots as group with corresponding service details and total slots count.
 * also filter out those slots, those corresponding service isDeleted false
 */
const getAllSlotsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // ------------ fields limitng
    let projectFields = {};
    if (query.fields) {
        const isExclusion = query.fields.startsWith("-");
        const fields = query.fields.replace("-", "").split(",");
        // --------- make project fields object
        fields.forEach((field) => {
            projectFields[field.trim()] = isExclusion ? 0 : 1;
        });
    }
    else {
        projectFields = {
            __v: 0,
        };
    }
    const result = yield slot_model_1.Slot.aggregate([
        {
            $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "service",
            },
        },
        // service array to object mapping
        {
            $unwind: "$service",
        },
        // again filter slots based on service isDeleted false
        {
            $match: {
                "service.isDeleted": false,
            },
        },
        // fields limiting
        {
            $project: projectFields,
        },
    ]);
    return result;
});
/**
 * ------------------ get all Slots with service from db ----------------
 *
 * @returns return all slots with corresponding service by making group.
 */
const getAllSlotsWithServiceFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // group by service. each service details and total slots with count
    const result = yield slot_model_1.Slot.aggregate([
        {
            // group by service, count and corresponding slots
            $group: {
                _id: "$service",
                count: { $sum: 1 }, // count no of slots in each group
                slots: { $push: "$$ROOT" }, // collect all slots for each service
            },
        },
        {
            // join services collection to find out service details
            $lookup: {
                from: "services", // The collection name where the service data is stored
                localField: "_id", // as we store 'service' into _id
                foreignField: "_id",
                as: "serviceDetails", // The field name where the populated service data will be stored
            },
        },
        {
            $match: { "serviceDetails.isDeleted": false }, // keep only document that isDeleted false
        },
    ]);
    return result;
});
/**
 * ------------------ get available slots ----------------
 *
 * @param req request object, it holds query parameters serviceId and date of a slot
 * @validation keep only slots, those service isDeleted false
 * @returns all the available slots with corresponding service details
 */
const getAvailableSlotsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // make query for exact matching slots
    let matchQuery = { isBooked: booking_constant_1.BOOKING_TYPE.available };
    if (query === null || query === void 0 ? void 0 : query.serviceId)
        matchQuery.service = query.serviceId;
    if (query === null || query === void 0 ? void 0 : query.date)
        matchQuery.date = query.date;
    // ------------ fields limitng
    let projectFields = {};
    if (query.fields) {
        const isExclusion = query.fields.startsWith("-");
        const fields = query.fields.replace("-", "").split(",");
        // --------- make project fields object
        fields.forEach((field) => {
            projectFields[field.trim()] = isExclusion ? 0 : 1;
        });
    }
    else {
        projectFields = {
            __v: 0,
        };
    }
    const result = yield slot_model_1.Slot.aggregate([
        // exact matching slots
        {
            $match: matchQuery,
        },
        // populate
        {
            $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "service",
            },
        },
        // service array to object mapping
        {
            $unwind: "$service",
        },
        // again filter slots based on service isDeleted false
        {
            $match: {
                "service.isDeleted": false,
            },
        },
        // fields limiting
        {
            $project: projectFields,
        },
    ]);
    return result;
});
/**
 * ------------------ get single Slot from db ----------------
 *
 * @param id slot id provided by mongodb
 * @validation throw an error if corresponding service is deleted of the requested slot
 * @returns single slot
 */
const getSingleSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result = (yield slot_model_1.Slot.findById(id).populate("service"));
    // throw an error is service is deleted of the requested slot
    if (result === null || result === void 0 ? void 0 : result.service.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Slot is not available, because corresponding service is deleted");
    }
    return result;
});
/**
 *  ------------------ delete an Slot from db ----------------
 *
 * @param id slot id provided by mongodb
 * @validations don't delete a slot if it is already booked, also check when updating
 * @returns deleted slot
 */
const deleteSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if slot is already booked
    const slot = yield slot_model_1.Slot.findById(id);
    if (!slot) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Slot is not found");
    }
    if ((slot === null || slot === void 0 ? void 0 : slot.isBooked) === booking_constant_1.BOOKING_TYPE.booked) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You can not delete this slot, as it is already booked!");
    }
    const result = yield slot_model_1.Slot.findOneAndDelete({
        _id: id,
        isBooked: { $ne: booking_constant_1.BOOKING_TYPE.booked }, // ensure slot not booked
    });
    if (!result) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Slot is deleted or already booked");
    }
    return result;
});
/**
 *  ------------------ toggle slot ----------------
 *
 * @param id slot id provided by mongodb
 * @validations don't toggle a slot if it is already booked
 * @returns updated slot data
 */
const slotStatusToggleIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if slot is already booked, exists or not cancelled
    const slot = yield slot_model_1.Slot.findById(id);
    if (!slot) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Slot not found!");
    }
    if ((slot === null || slot === void 0 ? void 0 : slot.isBooked) === booking_constant_1.BOOKING_TYPE.booked) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You can not delete this slot, as it is already booked!");
    }
    // make slot toggle data for database
    const toggleStatus = (slot === null || slot === void 0 ? void 0 : slot.isBooked) === "available" ? "canceled" : "available";
    const result = yield slot_model_1.Slot.findByIdAndUpdate(id, { isBooked: toggleStatus }, { new: true, runValidators: true });
    return result;
});
exports.SlotServices = {
    createSlotIntoDB,
    getAllSlotsFromDB,
    getAllSlotsWithServiceFromDB,
    getAvailableSlotsFromDB,
    getSingleSlotFromDB,
    deleteSlotFromDB,
    slotStatusToggleIntoDB,
};
