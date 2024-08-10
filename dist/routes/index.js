"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const service_routes_1 = require("../modules/service/service.routes");
const slot_routes_1 = require("../modules/slot/slot.routes");
const router = (0, express_1.Router)();
// users routes
router.use("/users", user_routes_1.userRoutes);
// auth routes
router.use("/auth", auth_route_1.authRoutes);
// service routes
router.use("/services", service_routes_1.serviceRoutes);
// slots routes
router.use("/slots", slot_routes_1.slotRoutes);
exports.default = router;
