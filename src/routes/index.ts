import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { serviceRoutes } from "../modules/service/service.routes";
import { slotRoutes } from "../modules/slot/slot.routes";

const router = Router();
// users routes
router.use("/users", userRoutes);

// auth routes
router.use("/auth", authRoutes);

// service routes
router.use("/services", serviceRoutes);

// slots routes
router.use("/slots", slotRoutes);

export default router;
