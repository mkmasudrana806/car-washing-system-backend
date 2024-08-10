import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.route";

const router = Router();
// users routes
router.use("/users", userRoutes);

// auth routes
router.use("/auth", authRoutes);

export default router;
