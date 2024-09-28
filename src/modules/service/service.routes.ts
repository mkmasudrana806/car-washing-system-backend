// handle all Service routes
import express from "express";
import { ServiceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { ServiceValidations } from "./service.validation";
import auth from "../../middlewares/auth";

import { SlotValidations } from "../slot/slot.validation";
import { SlotControllers } from "../slot/slot.controller";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

// create a service
router.post(
  "/create-service",
  auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService
);

// get all Services
router.get("/", ServiceControllers.getAllServices);

// get single Service
router.get("/:id", ServiceControllers.getSingleService);

// get service with slots
router.get("/service-slots/:id", ServiceControllers.getServiceWithSlots);

// delete an Service
router.delete("/:id", auth(USER_ROLE.admin), ServiceControllers.deleteService);

// update an Service
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);


// export routes
export const serviceRoutes = router;
