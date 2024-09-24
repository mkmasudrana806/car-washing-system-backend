import { ServiceServices } from "./service.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { ObjectId } from "mongoose";

// ------------------ create a Service ------------------
const createService = catchAsync(async (req, res) => {
  const result = await ServiceServices.createServiceIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service created successfully",
    data: result,
  });
});

// ------------------ get all Services ------------------
const getAllServices = catchAsync(async (req, res) => {
  const { result, meta } = await ServiceServices.getAllServicesFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result,
  });
});

// ------------------ get all slots of a service ------------------
const getServiceWithSlots = catchAsync(async (req, res) => {
  const result = await ServiceServices.getServiceWithSlotsFromDB(
    req.params?.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slots of service retrieved successfully",
    data: result,
  });
});

// ------------------ get single Service ------------------
const getSingleService = catchAsync(async (req, res) => {
  const result = await ServiceServices.getSingleServiceFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service retrived successfully",
    data: result,
  });
});

// ------------------ delete an Service ------------------
const deleteService = catchAsync(async (req, res) => {
  const result = await ServiceServices.deleteServiceFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: result,
  });
});

// ------------------ update an Service ------------------
const updateService = catchAsync(async (req, res) => {
  const result = await ServiceServices.updateServiceIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
});

// export all Services controllers
export const ServiceControllers = {
  createService,
  getAllServices,
  getServiceWithSlots,
  getSingleService,
  deleteService,
  updateService,
};
