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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../app/config"));
const auth_utils_1 = require("./auth.utils");
// ----------------- register user into database -----------------------
const RegisterUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is already exists!");
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
// ----------------- login user into database -----------------------
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Password is not matched!");
    }
    // jwt data
    const jwtPayload = { userEmail: user === null || user === void 0 ? void 0 : user.email, role: user === null || user === void 0 ? void 0 : user.role };
    // access granted: Send AccessToken
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        user,
        accessToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
// --------------- change password --------------------
const changePasswordIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByEmail(userData.userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Password is not matched!");
    }
    // hash the new password
    const hashPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // update the password
    const result = yield user_model_1.User.findOneAndUpdate({
        email: userData.userEmail,
        role: userData.role,
    }, {
        password: hashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, { new: true });
    return result;
});
exports.authServices = {
    RegisterUserIntoDB,
    loginUserIntoDB,
    changePasswordIntoDB,
};
