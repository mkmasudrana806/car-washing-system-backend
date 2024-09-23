"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
// service schema
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    serviceImgUrl: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// isServiceExists statics methods
serviceSchema.statics.isServicExistsById = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.Service.findById(_id);
        if (result === null || result === void 0 ? void 0 : result.isDeleted) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Service is already deleted");
        }
        return result;
    });
};
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
