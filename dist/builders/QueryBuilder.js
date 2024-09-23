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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    /**
     * constructor
     * @param modelQuery Model
     * @param query query parameter
     * @features search, filter, paginate, fieldsLimiting, sort
     */
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    /**
     * search
     * @param searchableFields an array of searchable fields.
     * @example example ["firstName", "email"]
     * @returns partial matching data
     */
    search(searchableFields) {
        var _a;
        let searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }
    /**
     * filter
     * @returns return extact matching data
     * @example email=mkmasudrana806@gmail.com. comman seperated multiple fields
     * @return returns data matching with that email
     */
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        // Handle price range for exact matches
        if (queryObj.minPrice && queryObj.maxPrice) {
            queryObj.price = {
                $gte: Number(queryObj.minPrice),
                $lte: Number(queryObj.maxPrice),
            };
            delete queryObj.minPrice;
            delete queryObj.maxPrice;
        }
        // Handle other filters like price or other exact matches
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    // sorting
    /**
     *
     * @returns return sorted data based on query field.
     * by default sort data as descending order based on 'createdAt' field.
     * @example query parameter: sort=email, it sort based on email as ascending order.
     * sort=-email, negative sign means, sort as descending order
     */
    sort() {
        var _a, _b;
        let sortFields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortFields);
        return this;
    }
    /**
     * pagination example :-
     * @default by default page=1 and limit=10
     * @example query parameter: page=1&limit=20
     * @returns return page wise data. by default each page 10 data
     */
    paginate() {
        var _a, _b;
        let page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        let limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        let skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // fields limiting
    /**
     * @default by default it remove only __v fields
     * @example query parameter: fields=firstName,email etc comma separated
     * @returns return specific fields only
     */
    fieldsLimiting() {
        var _a, _b;
        let fields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    /**
     * -------------------  count documents -------------------------
     * @returns it return total documents, page, limit and totalPage
     */
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueryries = this.modelQuery.getFilter(); // it gives previous filtered documents
            const total = yield this.modelQuery.model.countDocuments(totalQueryries);
            let page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            let limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
