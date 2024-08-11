import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

// ****************** Additional Routes ************************
// ------------------ get all users from db ----------------
const getAllUsersFromDB = async () => {
  const result = await User.find({});
  return result;
};

// ------------------ get single user from db ----------------
const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

// ------------------ delete an user from db ----------------
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// ------------------ update an user into db ----------------
const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  // Allowed fields to update data
  const allowedFields: (keyof TUser)[] = ["name", "phone", "address"];

  // Filter payload to only include allowed fields
  const updateData: Record<string, unknown> = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  });

  // Check if user exists and is not deleted
  if (!(await User.isUserExistsById(id))) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }
 
  const result = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true, // Run mongoose schema validation before updating new data
  });
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
};
