// handle all Slot routes
import express, { NextFunction, Request, Response } from "express";
import { SlotControllers } from "./slot.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { SlotValidations } from "./slot.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

// create a Slot
router.post(
  "/create-Slot",
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot
);

// get all Slots
router.get("/", SlotControllers.getAllSlots);

// get all available slots
router.get("/availability", SlotControllers.getAvailableSlots);

// get single Slot
router.get("/:id", SlotControllers.getSingleSlot);

// delete an Slot
router.delete("/:id", auth(USER_ROLE.admin), SlotControllers.deleteSlot);

// update an Slot
router.put(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.updateSlotValidationSchema),
  SlotControllers.updateSlot
);

// export routes
export const slotRoutes = router;
