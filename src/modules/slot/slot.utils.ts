import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";

// ------------------ convert time to minutes ------------------
// 01:25 => 85
export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};

// ------------------ conver minute to time format ------------------
// 85 => 01:25
export const minuteToTime = (minute: number) => {
  const hours = Math.floor(minute / 60);
  const mins = minute % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// ------------------ is time conflict ------------------
export const isSlotConflict = async (
  payload: TSlot
): Promise<object | boolean> => {
  // find same date slots, also filter out if any slot's service is deleted
  const previousSlotsForSameDate = await Slot.find({
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
  const newStartTime = timeToMinutes(payload.startTime);
  const newEndTime = timeToMinutes(payload.endTime);
  for (const slot of previousSlotsForSameDate) {
    // skip those slots, which service is deleted
    if (slot.service === null) {
      continue;
    }
    // existing slots time
    const existingStartTime = timeToMinutes(slot.startTime);
    const existingEndTime = timeToMinutes(slot.endTime);

    if (
      (existingStartTime < newEndTime && existingEndTime > newStartTime) ||
      (existingEndTime > newStartTime && existingStartTime < newEndTime)
    ) {
      flag = true;
      conflictSlots.push(slot);
    }
  }
  return flag ? conflictSlots : false;
};
