"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const user_constant_1 = require("./user.constant");
/**
 * ------------------ get all users from db ----------------
 *
 * @param user jwt authentication token data, including email, userId, role
 * @param query req.query object containing query parameters
 * @validations check if the user has access only users data, and admin has access both user and admin data.
 * @returns if user role 'user'. return only users data. otherwise return both user and admin data, those are not deleted also
 */
const getAllUsersFromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    let userQuery;
    if ((user === null || user === void 0 ? void 0 : user.role) === "user") {
        userQuery = new QueryBuilder_1.default(user_model_1.User.find({ role: "user", isDeleted: false }), query)
            .search(user_constant_1.userSearchableFields)
            .filter()
            .paginate()
            .sort()
            .fieldsLimiting();
    }
    else {
        userQuery = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false }), query)
            .search(user_constant_1.userSearchableFields)
            .filter()
            .paginate()
            .sort()
            .fieldsLimiting();
    }
    const result = yield userQuery.modelQuery;
    return result;
});
/**
 * ------------------ get single user from db ----------------
 *
 * @param id user id provided by mongodb
 * @validation if user is deleted, throw an error
 * @returns return an user
 */
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (result === null || result === void 0 ? void 0 : result.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is deleted");
    }
    return result;
});
/**
 * ------------------ delete an user from db ----------------
 *
 * @param id user id provided by mongodb
 * @returns return deleted user data
 */
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
/**
 * ------------------ update an user into db ----------------
 * @param id user id provided by mongodb
 * @param payload updated user data
 * @validations define allowed fields and filter out new updated object.
 * check if the user is exists and not deleted
 * @returns return updated data
 */
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Allowed fields to update data
    const allowedFields = ["name", "phone", "address"];
    // Filter payload to only include allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            updateData[field] = payload[field];
        }
    });
    // Check if user exists and is not deleted
    if (!(yield user_model_1.User.isUserExistsById(id))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true, // Run mongoose schema validation before updating new data
    });
    return result;
});
exports.UserServices = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUserIntoDB,
};
