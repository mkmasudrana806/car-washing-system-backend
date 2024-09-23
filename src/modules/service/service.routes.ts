// handle all Service routes
import express from "express";
import { ServiceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { ServiceValidations } from "./service.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";
import { SlotValidations } from "../slot/slot.validation";
import { SlotControllers } from "../slot/slot.controller";

const router = express.Router();

// create a service
router.post(
  "/create-service",
  // auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService
);

// get all Services
router.get("/", ServiceControllers.getAllServices);

// get single Service
router.get("/:id", ServiceControllers.getSingleService);

// delete an Service
router.delete("/:id", auth(USER_ROLE.admin), ServiceControllers.deleteService);

// update an Service
router.put(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);

router.post(
  "/slots",
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot
);

// export routes
export const serviceRoutes = router;
