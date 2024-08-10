import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { serviceRoutes } from "../modules/service/service.routes";

const router = Router();
// users routes
router.use("/users", userRoutes);

// auth routes
router.use("/auth", authRoutes);

// service routes
router.use("/services", serviceRoutes);

export default router;
