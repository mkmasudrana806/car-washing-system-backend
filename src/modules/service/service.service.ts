import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TService } from "./service.interface";
import { Service } from "./service.model";
import QueryBuilder from "../../builders/QueryBuilder";
import { serviceSearchableFields } from "./service.constant";
import mongoose, { ObjectId } from "mongoose";

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
    .filter()
    .sort()
    .paginate();
  const result = await serviceQuery.modelQuery;
  const meta = await serviceQuery.countTotal();

  return { result, meta };
};

/**
 * ------------------ get service with slots from db ----------------
 *
 * @param serviceId passed from controller
 * @uses using aggregation pipeline to get all slots with service
 * @returns returns service with all slots belong to this service
 */
const getServiceWithSlotsFromDB = async (serviceId: string) => {
  const objectId = new mongoose.Types.ObjectId(serviceId);

  const result = await Service.aggregate([
    {
      $match: { _id: objectId },
    },
    {
      // Lookup slots for the service
      $lookup: {
        from: "slots", // Name of the Slot collection
        localField: "_id", // Field in the Service collection to match
        foreignField: "service", // Field in the Slot collection to match
        as: "slots", // Name of the output array with matching slots
      },
    },
    {
      // Add a field to filter slots based on the date
      $addFields: {
        slots: {
          $filter: {
            input: "$slots", // Array to filter
            as: "slot", // Alias for each slot in the array
            cond: {
              // Compare slot.date with the current date (formatted as YYYY-MM-DD)
              $gte: [
                "$$slot.date",
                new Date().toISOString().split("T")[0], // Current date as string in YYYY-MM-DD
              ],
            },
          },
        },
      },
    },
  ]);

  return result[0];
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
  getServiceWithSlotsFromDB,
  getSingleServiceFromDB,
  deleteServiceFromDB,
  updateServiceIntoDB,
};
