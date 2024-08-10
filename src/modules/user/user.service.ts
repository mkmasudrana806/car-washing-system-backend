import { TUser } from "./user.interface";
import { User } from "./user.model";

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
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
};
