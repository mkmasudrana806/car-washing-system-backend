"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
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
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
