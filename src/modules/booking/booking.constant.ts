export const VEHICLE_TYPE = [
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

export const BOOKING_TYPE = {
  available: "available",
  booked: "booked",
  cancelled: "canceled",
};

// customer.name, customer.email, customer.phone, service.name, service.description, booking.vehicleType, booking.vehicleBrand
export const bookingsSearchableFields = [
  "customer.name",
  "customer.email",
  "customer.phone",
  "service.name",
  "service.description",
  "vehicleType",
  "vehicleBrand",
];
