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
// ****************** Additional Routes ************************
// ------------------ get all users from db ----------------
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({});
    return result;
});
// ------------------ get single user from db ----------------
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
// ------------------ delete an user from db ----------------
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ------------------ update an user into db ----------------
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
