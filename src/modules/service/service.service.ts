import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TService } from "./service.interface";
import { Service } from "./service.model";
import QueryBuilder from "../../builders/QueryBuilder";
import { serviceSearchableFields } from "./service.constant";

/**
 * ------------------ create service into db ----------------
 *
 * @param payload new Service data passed by client
 * @returns newly created Service
 */
const createServiceIntoDB = async (payload: TService) => {
  const result = await Service.create(payload);
  return result;
};

/**
 * ------------------ get all Services from db ----------------
 *
 * @param query req.query passed from controller
 * @uses here query builder is applied.
 *  we can use filter, search, sort, paginate and fields limiting query params in our api route
 * @returns returns all Services which are not deleted
 */
const getAllServicesFromDB = async (query: Record<string, unknown>) => {
  const serviceQuery = new QueryBuilder(
    Service.find({ isDeleted: { $ne: true } }),
    query
  )
    .search(serviceSearchableFields)
    .paginate();
  const result = await serviceQuery.modelQuery;
  return result;
};

/**
 * ------------------ get single Service from db ----------------
 *
 * @param id service id provided by the mongodb
 * @returns return sigle service, which is not deleted
 */
const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findOne({ _id: id, isDeleted: { $ne: true } });
  return result;
};

/**
 * ------------------ delete an Service from db ----------------
 *
 * @param id service id provided by the mongodb
 * @returns return deleted service
 */
const deleteServiceFromDB = async (id: string) => {
  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

/**
 * ------------------ update an Service into db ----------------
 *
 * @param id service id provided by the mongodb
 * @param payload updated service data
 * @validations checks if the service exists or already deleted
 * @returns return updated service data
 */
const updateServiceIntoDB = async (id: string, payload: Partial<TService>) => {
  // check if the service is exists
  if (!(await Service.isServicExistsById(id))) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  }

  const result = await Service.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const ServiceServices = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  deleteServiceFromDB,
  updateServiceIntoDB,
};
