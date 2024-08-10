"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_constant_1 = require("./auth.constant");
const user_validation_1 = require("../user/user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// register an user
router.post("/signup", (0, validateRequestData_1.default)(user_validation_1.UserValidations.createUserValidationSchema), auth_controller_1.authControllers.registerUser);
// login an user
router.post("/login", (0, validateRequestData_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.authControllers.loginUser);
// change password
router.post("/change-password", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(auth_validation_1.authValidations.changePasswordValidationSchema), auth_controller_1.authControllers.changePassword);
exports.authRoutes = router;
