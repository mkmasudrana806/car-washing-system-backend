"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// handle all user routes
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constant_1 = require("../auth/auth.constant");
const router = express_1.default.Router();
// get all users
router.get("/", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.getAllUsers);
// get single user
router.get("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.getSingleUser);
// delete an user
router.delete("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.deleteUser);
// update an user
router.patch("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(user_validation_1.UserValidations.updateUserValidationSchema), user_controller_1.UserControllers.updateUser);
// export routes
exports.userRoutes = router;
