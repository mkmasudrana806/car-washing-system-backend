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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../app/config"));
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
// user schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        select: 0, // hide password field in client response
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
    },
    address: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// *************** document middleware start **************
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hassing password and save into DB
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// ****************** statics methods ***************************
/**
 * @param email email address of an user
 * @returns return user data found by email address
 */
userSchema.statics.isUserExistsByemail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.User.findOne({ email }).select("+password");
        return result;
    });
};
/**
 * @param _id user id provided mongodb
 * @validation if user is deleted, throw an error
 * @returns return user data if it's not deleted
 */
userSchema.statics.isUserExistsById = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.User.findById(_id).select("+password");
        if (result === null || result === void 0 ? void 0 : result.isDeleted) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User is already deleted");
        }
        return result;
    });
};
/**
 * @param plain user password passed from client
 * @param hash hashed password of an user found in the database
 * @returns return true if password matches, false otherwise
 */
userSchema.statics.isPasswordMatched = function (plain, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(plain, hash);
        return result;
    });
};
// jwt invalidates
/**
 *
 * @param passwordChangedTimestamp last password change timestamp of an user
 * @param jwtIssuedtimestamp // jwt issued timestamp of an authenticated user. iat timestamp
 * @returns return true if isJWTIssuedBeforePasswordChange true, false otherwise
 */
userSchema.statics.isJWTIssuedBeforePasswordChange = function (passwordChangedTimestamp, jwtIssuedtimestamp) {
    // UTC datetime to milliseconds
    const passwordChangedtime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedtime > jwtIssuedtimestamp;
};
// set empty string after saving password
// set password to empty string before send response to client
userSchema.post("save", function (doc) {
    doc.password = "";
});
// user model export
exports.User = (0, mongoose_1.model)("User", userSchema);
