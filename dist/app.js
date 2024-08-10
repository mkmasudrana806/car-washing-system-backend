"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// parsers ( middleware )
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
// routes moddleware
app.use("/api", routes_1.default);
// not found route
app.use(notFound_1.default);
// global error handler route
app.use(globalErrorHandler_1.default);
exports.default = app;
