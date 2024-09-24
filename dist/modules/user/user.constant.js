"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchableFields = exports.allowedFieldsToUpdate = void 0;
// allowed fields to update user
exports.allowedFieldsToUpdate = [
    "name",
    "age",
    "gender",
    "contact",
    "address",
    "profileImg",
];
// search able fields to search
exports.searchableFields = ["name.firstName", "email", "address"];
