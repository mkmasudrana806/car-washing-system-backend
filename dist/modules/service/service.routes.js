"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
// handle all Service routes
const express_1 = __importDefault(require("express"));
const service_controller_1 = require("./service.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const service_validation_1 = require("./service.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constant_1 = require("../auth/auth.constant");
const slot_validation_1 = require("../slot/slot.validation");
const slot_controller_1 = require("../slot/slot.controller");
const router = express_1.default.Router();
// create a service
router.post("/create-service", 
// auth(USER_ROLE.admin),
(0, validateRequestData_1.default)(service_validation_1.ServiceValidations.createServiceValidationSchema), service_controller_1.ServiceControllers.createService);
// get all Services
router.get("/", service_controller_1.ServiceControllers.getAllServices);
// get single Service
router.get("/:id", service_controller_1.ServiceControllers.getSingleService);
// delete an Service
router.delete("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), service_controller_1.ServiceControllers.deleteService);
// update an Service
router.put("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(service_validation_1.ServiceValidations.updateServiceValidationSchema), service_controller_1.ServiceControllers.updateService);
router.post("/slots", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(slot_validation_1.SlotValidations.createSlotValidationSchema), slot_controller_1.SlotControllers.createSlot);
// export routes
exports.serviceRoutes = router;
