import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { Service } from "../service/service.model";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { minuteToTime, timeToMinutes } from "./slot.utils";
import { BOOKING_TYPE } from "../booking/booking.constant";

// ------------------ create Slot into db ----------------
const createSlotIntoDB = async (payload: TSlot) => {
  // const result = await Slot.create(payload);
  const service = await Service.findById(payload.service);

  // convert start and end time to minutes
  const startTime = timeToMinutes(payload.startTime);
  const endTime = timeToMinutes(payload.endTime);

  // calculate start and end time difference
  const totalMinutes = endTime - startTime;

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

  let currentStartTime = startTime;
  for (let i = 0; i < slots; i++) {
    const slotStartTime = minuteToTime(currentStartTime);
    const slotEndTime = minuteToTime(
      currentStartTime + Number(service?.duration)
    );

    newSlots.push({
      service: payload.service,
      date: payload?.date,
      startTime: slotStartTime,
      endTime: slotEndTime,
    });

    currentStartTime += Number(service?.duration);
  }

  const result = await Slot.insertMany(newSlots);
  return result;
};

// ------------------ get all Slots from db ----------------
const getAllSlotsFromDB = async () => {
  const result = await Slot.find({});
  return result;
};

// ------------------ get available slots ----------------
const getAvailableSlotsFromDB = async (req: Record<string, unknown>) => {
  // make query for exact matching slots
  let query: any = { isBooked: BOOKING_TYPE.available };
  if (req?.serviceId) query.service = req.serviceId;
  if (req?.date) query.date = req.date;

  console.log(query);
  const result = await Slot.find(query).populate("service");
  return result;
};

// ------------------ get single Slot from db ----------------
const getSingleSlotFromDB = async (id: string) => {
  const result = await Slot.findById(id);
  return result;
};

// ------------------ delete an Slot from db ----------------
const deleteSlotFromDB = async (id: string) => {
  const result = await Slot.findByIdAndDelete(id, { new: true });
  return result;
};

// ------------------ update an Slot into db ----------------
const updateSlotIntoDB = async (id: string, payload: Partial<TSlot>) => {
  const result = await Slot.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const SlotServices = {
  createSlotIntoDB,
  getAllSlotsFromDB,
  getAvailableSlotsFromDB,
  getSingleSlotFromDB,
  deleteSlotFromDB,
  updateSlotIntoDB,
};
