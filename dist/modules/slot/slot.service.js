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
// ------------------ create Slot into db ----------------
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Slot.create(payload);
    const service = yield service_model_1.Service.findById(payload.service);
    // convert start and end time to minutes
    const startTime = (0, slot_utils_1.timeToMinutes)(payload.startTime);
    const endTime = (0, slot_utils_1.timeToMinutes)(payload.endTime);
    // calculate start and end time difference
    const totalMinutes = endTime - startTime;
    if (totalMinutes < Number(service === null || service === void 0 ? void 0 : service.duration)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Service duration is large than start and end time difference");
    }
    // calculate no of slots
    const slots = Math.floor(totalMinutes / Number(service === null || service === void 0 ? void 0 : service.duration));
    // make new slots array to insert into database
    const newSlots = [];
    let currentStartTime = startTime;
    for (let i = 0; i < slots; i++) {
        const slotStartTime = (0, slot_utils_1.minuteToTime)(currentStartTime);
        const slotEndTime = (0, slot_utils_1.minuteToTime)(currentStartTime + Number(service === null || service === void 0 ? void 0 : service.duration));
        newSlots.push({
            service: payload.service,
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            startTime: slotStartTime,
            endTime: slotEndTime,
        });
        currentStartTime += Number(service === null || service === void 0 ? void 0 : service.duration);
    }
    const result = yield slot_model_1.Slot.insertMany(newSlots);
    return result;
});
// ------------------ get all Slots from db ----------------
const getAllSlotsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.Slot.find({});
    return result;
});
// ------------------ get available slots ----------------
const getAvailableSlotsFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // make query for exact matching slots
    let query = { isBooked: booking_constant_1.BOOKING_TYPE.available };
    if (req === null || req === void 0 ? void 0 : req.serviceId)
        query.service = req.serviceId;
    if (req === null || req === void 0 ? void 0 : req.date)
        query.date = req.date;
    console.log(query);
    const result = yield slot_model_1.Slot.find(query).populate("service");
    return result;
});
// ------------------ get single Slot from db ----------------
const getSingleSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.Slot.findById(id);
    return result;
});
// ------------------ delete an Slot from db ----------------
const deleteSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.Slot.findByIdAndDelete(id, { new: true });
    return result;
});
// ------------------ update an Slot into db ----------------
const updateSlotIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.Slot.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.SlotServices = {
    createSlotIntoDB,
    getAllSlotsFromDB,
    getAvailableSlotsFromDB,
    getSingleSlotFromDB,
    deleteSlotFromDB,
    updateSlotIntoDB,
};
