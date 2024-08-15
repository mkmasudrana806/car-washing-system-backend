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
// customer.name, customer.email, customer.phone, service.name, service.description, booking.vehicleType, booking.vehicleBrand
exports.bookingsSearchableFields = [
    "customer.name",
    "customer.email",
    "customer.phone",
    "service.name",
    "service.description",
    "vehicleType",
    "vehicleBrand",
];
