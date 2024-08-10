import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { Slot } from "./slot.model";
import { SlotServices } from "./slot.service";

// ------------------ create a Slot ------------------
const createSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.createSlotIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slot is created successfully",
    data: result,
  });
});

// ------------------ get available slots ------------------
const getAvailableSlots = catchAsync(async (req, res) => {
  const result = await SlotServices.getAvailableSlotsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slots are retrieved successfully",
    data: result,
  });
});

// ------------------ get all Slots ------------------
const getAllSlots = catchAsync(async (req, res) => {
  const result = await SlotServices.getAllSlotsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Slots are retrived successfully",
    data: result,
  });
});

// ------------------ get single Slot ------------------
const getSingleSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.getSingleSlotFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slot is retrived successfully",
    data: result,
  });
});

// ------------------ delete an Slot ------------------
const deleteSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.deleteSlotFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slot is deleted successfully",
    data: result,
  });
});

// ------------------ update an Slot ------------------
const updateSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.updateSlotIntoDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slot is updated successfully",
    data: result,
  });
});

// export all Slots controllers
export const SlotControllers = {
  createSlot,
  getAllSlots,
  getAvailableSlots,
  getSingleSlot,
  deleteSlot,
  updateSlot,
};
