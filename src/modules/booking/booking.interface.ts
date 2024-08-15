import { Model } from "mongoose";
import { Types } from "mongoose";

type TVehicle =
  | "car"
  | "truck"
  | "SUV"
  | "van"
  | "motercycle"
  | "bus"
  | "electricVehicle"
  | "hybridVehicle"
  | "bicycle"
  | "tractor";

export type TBooking = {
  customer: Types.ObjectId;
  service: Types.ObjectId;
  slot: Types.ObjectId;
  vehicleType: TVehicle;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;
  isDeleted: boolean;
};

// isBookingExistsByid interface for statics model
export interface IBookingModel extends Model<TBooking> {
  isBookingExistsById(_id: string): Promise<TBooking | null>;
}
