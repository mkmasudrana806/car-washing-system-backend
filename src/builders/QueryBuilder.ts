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
    const queryObj = { ...this.query }; // copied query object
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
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
   * @default by default page=1 and limit=10
   * @example query parameter: page=1&limit=20
   * @returns return page wise data. by default each page 10 data
   */
  paginate() {
    let page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
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
    let fields =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
