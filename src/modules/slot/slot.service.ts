import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { Service } from "../service/service.model";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { isSlotConflict, minuteToTime, timeToMinutes } from "./slot.utils";
import { BOOKING_TYPE } from "../booking/booking.constant";

/**
 * ------------------ create Slot into db ----------------
 *
 * @param payload data for creating a new slot
 * @validation slots for same service, two times not possible for same date
 * @validation slots for different service, overlap is not possible for the same date
 * @returns newly created all slots
 *
 */
const createSlotIntoDB = async (payload: TSlot) => {
  // check if service is exists
  const service = await Service.isServicExistsById(String(payload.service));

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  }

  // slots for same service not allowed at the same date
  const isSameDateExistsForService = await Slot.findOne({
    service: payload.service,
    date: payload.date,
  });
  if (isSameDateExistsForService) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "slots for same service not allowed at the same date"
    );
  }

  // check if the new service's slots has time conflict with the existing slots for the same date
  const isConflict = await isSlotConflict(payload);
  if (isConflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Time confliction for these slots: ${isConflict} `
    );
  }

  // convert start and end time to minutes for new slots
  const newStartTime = timeToMinutes(payload.startTime);
  const newEndTime = timeToMinutes(payload.endTime);

  // calculate start and end time difference
  const totalMinutes = newEndTime - newStartTime;

  if (totalMinutes < Number(service?.duration)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service duration is large than start and end time difference"
    );
  }

  // calculate no of slots
  const slots = Math.floor(totalMinutes / Number(service?.duration));

  // make new slots array to insert into database
  const newSlots = [];

  let currentStartTime = newStartTime;
  for (let i = 0; i < slots; i++) {
    const slotStartTime = minuteToTime(currentStartTime);
    const slotEndTime = minuteToTime(
      currentStartTime + Number(service?.duration)
    );

    newSlots.push({
      service: payload?.service,
      date: payload?.date,
      startTime: slotStartTime,
      endTime: slotEndTime,
    });

    currentStartTime += Number(service?.duration);
  }

  const result = await Slot.insertMany(newSlots);
  return result;
};

/**
 * ------------------ get all Slots from db ----------------
 *
 * @returns all slots as group with corresponding service details and total slots count.
 * also filter out those slots, those corresponding service isDeleted false
 */
const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
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

  const result = await Slot.aggregate([
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
};

/**
 * ------------------ get all Slots with service from db ----------------
 *
 * @returns return all slots with corresponding service by making group.
 */
const getAllSlotsWithServiceFromDB = async () => {
  // group by service. each service details and total slots with count
  const result = await Slot.aggregate([
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
};

/**
 * ------------------ get available slots ----------------
 *
 * @param req request object, it holds query parameters serviceId and date of a slot
 * @validation keep only slots, those service isDeleted false
 * @returns all the available slots with corresponding service details
 */
const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
  // make query for exact matching slots
  let matchQuery: any = { isBooked: BOOKING_TYPE.available };
  if (query?.serviceId) matchQuery.service = query.serviceId;
  if (query?.date) matchQuery.date = query.date;

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

  const result = await Slot.aggregate([
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
};

/**
 * ------------------ get single Slot from db ----------------
 *
 * @param id slot id provided by mongodb
 * @validation throw an error if corresponding service is deleted of the requested slot
 * @returns single slot
 */
const getSingleSlotFromDB = async (id: string) => {
  let result = (await Slot.findById(id).populate("service")) as any;

  // throw an error is service is deleted of the requested slot
  if (result?.service.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Slot is not available, because corresponding service is deleted"
    );
  }
  return result;
};

/**
 *  ------------------ delete an Slot from db ----------------
 *
 * @param id slot id provided by mongodb
 * @validations don't delete a slot if it is already booked, also check when updating
 * @returns deleted slot
 */
const deleteSlotFromDB = async (id: string) => {
  // check if slot is already booked
  const slot = await Slot.findById(id);
  if (!slot) {
    throw new AppError(httpStatus.FORBIDDEN, "Slot is not found");
  }
  if (slot?.isBooked === BOOKING_TYPE.booked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete this slot, as it is already booked!"
    );
  }
  const result = await Slot.findOneAndDelete({
    _id: id,
    isBooked: { $ne: BOOKING_TYPE.booked }, // ensure slot not booked
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Slot is deleted or already booked"
    );
  }
  return result;
};

/**
 *  ------------------ toggle slot ----------------
 *
 * @param id slot id provided by mongodb
 * @validations don't toggle a slot if it is already booked
 * @returns updated slot data
 */
const slotStatusToggleIntoDB = async (id: string) => {
  // check if slot is already booked, exists or not cancelled
  const slot = await Slot.findById(id);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found!");
  }
  if (slot?.isBooked === BOOKING_TYPE.booked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete this slot, as it is already booked!"
    );
  }
  // make slot toggle data for database
  const toggleStatus =
    slot?.isBooked === "available" ? "canceled" : "available";

  const result = await Slot.findByIdAndUpdate(
    id,
    { isBooked: toggleStatus },
    { new: true, runValidators: true }
  );
  return result;
};

export const SlotServices = {
  createSlotIntoDB,
  getAllSlotsFromDB,
  getAllSlotsWithServiceFromDB,
  getAvailableSlotsFromDB,
  getSingleSlotFromDB,
  deleteSlotFromDB,
  slotStatusToggleIntoDB,
};
