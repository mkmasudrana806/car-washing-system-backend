"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotRoutes = void 0;
// handle all Slot routes
const express_1 = __importDefault(require("express"));
const slot_controller_1 = require("./slot.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const slot_validation_1 = require("./slot.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constant_1 = require("../auth/auth.constant");
const router = express_1.default.Router();
// create a Slot
router.post("/create-slots", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(slot_validation_1.SlotValidations.createSlotValidationSchema), slot_controller_1.SlotControllers.createSlot);
// get all Slots
router.get("/", slot_controller_1.SlotControllers.getAllSlots);
// get all slots with service
router.get("/slots", slot_controller_1.SlotControllers.getAllSlotsWithService);
// get all available slots
router.get("/availability", slot_controller_1.SlotControllers.getAvailableSlots);
// get single Slot
router.get("/:id", slot_controller_1.SlotControllers.getSingleSlot);
// delete a Slot
router.delete("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), slot_controller_1.SlotControllers.deleteSlot);
// toggle slot status available to canceled if slot is not booked
router.patch("/toggle-slot-status/:id", slot_controller_1.SlotControllers.slotStatusToggle);
// export routes
exports.slotRoutes = router;
