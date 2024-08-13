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
exports.ServiceServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const service_model_1 = require("./service.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const service_constant_1 = require("./service.constant");
/**
 * ------------------ create service into db ----------------
 *
 * @param payload new Service data passed by client
 * @returns newly created Service
 */
const createServiceIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.create(payload);
    return result;
});
/**
 * ------------------ get all Services from db ----------------
 *
 * @param query req.query passed from controller
 * @uses here query builder is applied.
 *  we can use filter, search, sort, paginate and fields limiting query params in our api route
 * @returns returns all Services which are not deleted
 */
const getAllServicesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceQuery = new QueryBuilder_1.default(service_model_1.Service.find({ isDeleted: { $ne: true } }), query)
        .search(service_constant_1.serviceSearchableFields)
        .paginate();
    const result = yield serviceQuery.modelQuery;
    return result;
});
/**
 * ------------------ get single Service from db ----------------
 *
 * @param id service id provided by the mongodb
 * @returns return sigle service, which is not deleted
 */
const getSingleServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.findOne({ _id: id, isDeleted: { $ne: true } });
    return result;
});
/**
 * ------------------ delete an Service from db ----------------
 *
 * @param id service id provided by the mongodb
 * @returns return deleted service
 */
const deleteServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
/**
 * ------------------ update an Service into db ----------------
 *
 * @param id service id provided by the mongodb
 * @param payload updated service data
 * @validations checks if the service exists or already deleted
 * @returns return updated service data
 */
const updateServiceIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the service is exists
    if (!(yield service_model_1.Service.isServicExistsById(id))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    const result = yield service_model_1.Service.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.ServiceServices = {
    createServiceIntoDB,
    getAllServicesFromDB,
    getSingleServiceFromDB,
    deleteServiceFromDB,
    updateServiceIntoDB,
};
