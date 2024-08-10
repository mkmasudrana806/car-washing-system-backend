"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minuteToTime = exports.timeToMinutes = void 0;
// convert time to minutes
// 01:25 => 85
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
};
exports.timeToMinutes = timeToMinutes;
// conver minute to time format
// 85 => 01:25
const minuteToTime = (minute) => {
    const hours = Math.floor(minute / 60);
    const mins = minute % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
exports.minuteToTime = minuteToTime;
