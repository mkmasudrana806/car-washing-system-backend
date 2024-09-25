"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsSearchableFields = exports.BOOKING_TYPE = exports.VEHICLE_TYPE = void 0;
exports.VEHICLE_TYPE = [
    "car",
    "truck",
    "SUV",
    "van",
    "motercycle",
    "bus",
    "electricVehicle",
    "hybridVehicle",
    "bicycle",
    "tractor",
];
exports.BOOKING_TYPE = {
    available: "available",
    booked: "booked",
    cancelled: "canceled",
};
// user.name, user.email, user.phone, service.name, service.description, booking.vehicleType, booking.vehicleBrand
exports.bookingsSearchableFields = [
    "user.name.firstName",
    "user.email",
    "user.phone",
    "service.name",
    "service.description",
    "vehicleInfo.vehicleType",
    "vehicleInfo.vehicleBrand",
];
