import { ServiceServices } from "./service.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// ------------------ create a Service ------------------
const createService = catchAsync(async (req, res) => {
  const result = await ServiceServices.createServiceIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service is created successfully",
    data: result,
  });
});

// ------------------ get all Services ------------------
const getAllServices = catchAsync(async (req, res) => {
  const result = await ServiceServices.getAllServicesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Services are retrived successfully",
    data: result,
  });
});

// ------------------ get single Service ------------------
const getSingleService = catchAsync(async (req, res) => {
  const result = await ServiceServices.getSingleServiceFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service is retrived successfully",
    data: result,
  });
});

// ------------------ delete an Service ------------------
const deleteService = catchAsync(async (req, res) => {
  const result = await ServiceServices.deleteServiceFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service is deleted successfully",
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
    message: "Service is updated successfully",
    data: result,
  });
});

// export all Services controllers
export const ServiceControllers = {
  createService,
  getAllServices,
  getSingleService,
  deleteService,
  updateService,
};
