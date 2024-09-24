import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  /**
   * constructor
   * @param modelQuery Model
   * @param query query parameter
   * @features search, filter, paginate, fieldsLimiting, sort
   */
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   * search
   * @param searchableFields an array of searchable fields.
   * @example example ["firstName", "email"]
   * @returns partial matching data
   */
  search(searchableFields: string[]) {
    let searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
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
    const queryObj = { ...this.query };
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
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
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
    let sortFields =
      (this?.query?.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortFields as string);
    return this;
  }

  /**
   * pagination example :-
   * @example query parameter: page=1&limit=20
   * @returns return page wise data.
   */

  paginate() {
    let page = Number(this?.query?.page);
    let limit = Number(this?.query?.limit);
    if (page && limit) {
      let skip = (page - 1) * limit;
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }
    return this;
  }
  // fields limiting
  /**
   * @default by default it remove only __v fields
   * @example query parameter: fields=firstName,email etc comma separated
   * @returns return specific fields only
   */
  fieldsLimiting() {
    let fields =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /**
   * -------------------  count documents -------------------------
   * @returns it return total documents, page, limit and totalPage
   */
  async countTotal() {
    const totalQueryries = this.modelQuery.getFilter(); // it gives previous filtered documents
    const total = await this.modelQuery.model.countDocuments(totalQueryries);
    let page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}

export default QueryBuilder;
