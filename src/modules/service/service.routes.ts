// handle all Service routes
import express, { NextFunction, Request, Response } from "express";
import { ServiceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { ServiceValidations } from "./service.validation";
import auth from "../../middlewares/auth";
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

// delete an Service
router.delete("/:id", auth(USER_ROLE.admin), ServiceControllers.deleteService);

// update an Service
router.put(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);

// export routes
export const serviceRoutes = router;
