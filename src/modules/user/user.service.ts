import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builders/QueryBuilder";
import { userSearchableFields } from "./user.constant";

/**
 * ------------------ get all users from db ----------------
 *
 * @param user jwt authentication token data, including email, userId, role
 * @param query req.query object containing query parameters
 * @validations check if the user has access only users data, and admin has access both user and admin data.
 * @returns if user role 'user', return only users data. otherwise return both user and admin data, those are not deleted also
 */
const getAllUsersFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>
) => {
  let userQuery;
  if (user?.role === "user") {
    userQuery = new QueryBuilder(
      User.find({ role: "user", isDeleted: false }),
      query
    )
      .search(userSearchableFields)
      .filter()
      .paginate()
      .sort()
      .fieldsLimiting();
  } else {
    userQuery = new QueryBuilder(User.find({ isDeleted: false }), query)
      .search(userSearchableFields)
      .filter()
      .paginate()
      .sort()
      .fieldsLimiting();
  }
  const result = await userQuery.modelQuery;
  return result;
};

/**
 * ------------------ get single user from db ----------------
 *
 * @param id user id provided by mongodb
 * @validation if user is deleted, throw an error
 * @returns return an user
 */
const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);

  if (result?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  return result;
};

/**
 * ------------------ delete an user from db ----------------
 *
 * @param id user id provided by mongodb
 * @returns return deleted user data
 */
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

/**
 * ------------------ update an user into db ----------------
 * @param id user id provided by mongodb
 * @param payload updated user data
 * @validations define allowed fields and filter out new updated object.
 * check if the user is exists and not deleted
 * @returns return updated data
 */
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
