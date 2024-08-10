"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotRoutes = void 0;
// handle all slot routes
const express_1 = __importDefault(require("express"));
const slot_controller_1 = require("./slot.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const slot_validation_1 = require("./slot.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constant_1 = require("../auth/auth.constant");
const router = express_1.default.Router();
// create a slot
router.post("/create-slot", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(slot_validation_1.slotValidations.createslotValidationSchema), slot_controller_1.slotControllers.createslot);
// get all slots
router.get("/", slot_controller_1.slotControllers.getAllslots);
// get single slot
router.get("/:id", slot_controller_1.slotControllers.getSingleslot);
// delete an slot
router.delete("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), slot_controller_1.slotControllers.deleteslot);
// update an slot
router.put("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(slot_validation_1.slotValidations.updateslotValidationSchema), slot_controller_1.slotControllers.updateslot);
// export routes
exports.slotRoutes = router;
