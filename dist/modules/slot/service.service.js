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
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotslots = void 0;
const slot_model_1 = require("./slot.model");
// ------------------ create slot into db ----------------
const createslotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.slot.create(payload);
    return result;
});
// ------------------ get all slots from db ----------------
const getAllslotsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.slot.find({});
    return result;
});
// ------------------ get single slot from db ----------------
const getSingleslotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.slot.findById(id);
    return result;
});
// ------------------ delete an slot from db ----------------
const deleteslotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.slot.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ------------------ update an slot into db ----------------
const updateslotIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.slot.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.slotslots = {
    createslotIntoDB,
    getAllslotsFromDB,
    getSingleslotFromDB,
    deleteslotFromDB,
    updateslotIntoDB,
};
