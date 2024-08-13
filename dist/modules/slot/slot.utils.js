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
exports.isSlotConflict = exports.minuteToTime = exports.timeToMinutes = void 0;
const slot_model_1 = require("./slot.model");
// ------------------ convert time to minutes ------------------
// 01:25 => 85
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
};
exports.timeToMinutes = timeToMinutes;
// ------------------ conver minute to time format ------------------
// 85 => 01:25
const minuteToTime = (minute) => {
    const hours = Math.floor(minute / 60);
    const mins = minute % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
exports.minuteToTime = minuteToTime;
// ------------------ is time conflict ------------------
const isSlotConflict = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // find same date slots, also filter out if any slot's service is deleted
    const previousSlotsForSameDate = yield slot_model_1.Slot.find({
        date: payload.date,
    })
        .select({ startTime: 1, endTime: 1, service: 0, _id: 0 })
        .populate({
        path: "service",
        match: { isDeleted: false },
    });
    // store conflicts slot
    const conflictSlots = [];
    let flag = false;
    // new slots time
    const newStartTime = (0, exports.timeToMinutes)(payload.startTime);
    const newEndTime = (0, exports.timeToMinutes)(payload.endTime);
    for (const slot of previousSlotsForSameDate) {
        // skip those slots, which service is deleted
        if (slot.service === null) {
            continue;
        }
        // existing slots time
        const existingStartTime = (0, exports.timeToMinutes)(slot.startTime);
        const existingEndTime = (0, exports.timeToMinutes)(slot.endTime);
        if ((existingStartTime < newEndTime && existingEndTime > newStartTime) ||
            (existingEndTime > newStartTime && existingStartTime < newEndTime)) {
            flag = true;
            conflictSlots.push(slot);
        }
    }
    return flag ? conflictSlots : false;
});
exports.isSlotConflict = isSlotConflict;
