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
const allowedFieldUpdatedData_1 = __importDefault(require("../../utils/allowedFieldUpdatedData"));
const makeFlattenedObject_1 = __importDefault(require("../../utils/makeFlattenedObject"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../app/config"));
const appError_1 = __importDefault(require("../../utils/appError"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
/**
 * ----------------------- Create an user----------------------
 * @param file image file to upload (optional)
 * @param payload new user data
 * @returns return newly created user
 */
const createAnUserIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // set default password if password is not provided
    payload.password = payload.password || config_1.default.default_password;
    // check if the user already exists
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (user) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    // set profileImg if image is provided
    // if (file) {
    //   const imageName = `${payload.email}-${payload.name.firstName}`;
    //   const path = file.path;
    //   const uploadedImage: any = await sendImageToCloudinary(path, imageName);
    //   payload.profileImg = uploadedImage.secure_url;
    // }
    // set placeholder image if image is not provided
    if (!file || payload.profileImg === "") {
        payload.profileImg =
            "https://avatar.iran.liara.run/public/boy?username=Ash";
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
/**
 * ----------------------- get all users ----------------------
 * @return return all users
 */
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const meta = yield userQuery.countTotal();
    const result = yield userQuery.modelQuery;
    return { meta, result };
});
/**
 * -----------------  get me  -----------------
 * @param email email address
 * @param role user role
 * @returns own user data based on jwt payload data
 */
const getMe = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email, role });
    return result;
});
/**
 * --------------- delete an user form db ----------------
 * @param id user id
 * @returns return deleted user data
 */
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
/**
 * --------------- update an user form db ----------------
 * @param id user id
 * @param payload update user data
 * @featurs admin can change own and user data. user can change own data only
 * @returns return updated user data
 */
const updateUserIntoDB = (currentUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user exists not deleted or blocked
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Requested user not found!");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is already deleted!");
    }
    if (user.status === "blocked") {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is already blocked!");
    }
    // check if current logged user and request not same and role is user.
    // means an user cna not update another user data
    if (currentUser.email !== (user === null || user === void 0 ? void 0 : user.email) && currentUser.role === "user") {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
    }
    // filter allowed fileds only
    const allowedFieldData = (0, allowedFieldUpdatedData_1.default)(user_constant_1.allowedFieldsToUpdate, payload);
    // make flattened object
    const flattenedData = (0, makeFlattenedObject_1.default)(allowedFieldData);
    const result = yield user_model_1.User.findByIdAndUpdate(id, flattenedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
/**
 * -------------------- change user status ----------------------
 * @param id user id
 * @param payload user status payload
 * @validatios check if the user exists,not deleted. only admin can change user status
 * @note admin can not change own status. admin can change only user status
 * @returns return updated user status
 */
const changeUserStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists, not deleted. find user that has role as user
    const user = yield user_model_1.User.findOne({ _id: id, role: "user" });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserServices = {
    createAnUserIntoDB,
    getAllUsersFromDB,
    getMe,
    deleteUserFromDB,
    updateUserIntoDB,
    changeUserStatusIntoDB,
};
