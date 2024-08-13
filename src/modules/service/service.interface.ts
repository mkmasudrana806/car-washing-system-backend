import { Model } from "mongoose";

export type TService = {
  name: string;
  description: string;
  price: number;
  duration: number;
  isDeleted: boolean;
};

// statics model
export interface IServiceModel extends Model<TService> {
  isServicExistsById(_id: string): Promise<TService | null>;
}
