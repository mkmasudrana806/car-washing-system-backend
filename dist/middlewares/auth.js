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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const config_1 = __importDefault(require("../app/config"));
/**
 * ------------------- auth --------------------
 * @param requiredRoles user role like 'user', 'admin',
 * @returns return to next middleware and set user to Request object
 */
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // check if token is provided to headers
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
        }
        // decoded the token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
        }
        const { email, role, iat } = decoded;
        // check if the user exits and not blocked and not deleted
        const user = yield user_model_1.User.findOne({ email, role });
        if (!user) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Authorized user is not found!");
        }
        if (user.status === "blocked") {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Authorized user is already blocked!");
        }
        if (user.isDeleted) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Authorized user is already deleted!");
        }
        // check if the jwt issued before the password change
        if (user.passwordChangedAt &&
            user_model_1.User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat)) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        // check if the user role and token role same
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
        }
        // make sure project has index.d.ts file which include user in Request object anywhere in ./src directory
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
