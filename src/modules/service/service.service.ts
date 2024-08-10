import { TService } from "./service.interface";
import { Service } from "./service.model";

// ------------------ create service into db ----------------
const createServiceIntoDB = async (payload: TService) => {
  const result = await Service.create(payload);
  return result;
};

// ------------------ get all Services from db ----------------
const getAllServicesFromDB = async () => {
  const result = await Service.find({});
  return result;
};

// ------------------ get single Service from db ----------------
const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

// ------------------ delete an Service from db ----------------
const deleteServiceFromDB = async (id: string) => {
  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// ------------------ update an Service into db ----------------
const updateServiceIntoDB = async (id: string, payload: Partial<TService>) => {
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
