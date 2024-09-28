// handle all Slot routes
import express from "express";
import { SlotControllers } from "./slot.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { SlotValidations } from "./slot.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

// create a Slot
router.post(
  "/create-slots",
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot
);

// get all Slots
router.get("/", SlotControllers.getAllSlots);

// get all slots with service
router.get("/slots", SlotControllers.getAllSlotsWithService);

// get all available slots
router.get("/availability", SlotControllers.getAvailableSlots);

// get single Slot
router.get("/:id", SlotControllers.getSingleSlot);

// delete a Slot
router.delete("/:id", auth(USER_ROLE.admin), SlotControllers.deleteSlot);

// toggle slot status available to canceled if slot is not booked
router.patch("/toggle-slot-status/:id", SlotControllers.slotStatusToggle);

// export routes
export const slotRoutes = router;
