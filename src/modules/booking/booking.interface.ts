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
  user: Types.ObjectId;
  service: Types.ObjectId;
  slot: Types.ObjectId;
  vehicleInfo: TVehicleInfo;
  amount: number;
  date: Date;
  paymentId: string;
  isDeleted: boolean;
};

export type TVehicleInfo = {
  vehicleType: TVehicle;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;
};

// isBookingExistsByid interface for statics model
export interface IBookingModel extends Model<TBooking> {
  isBookingExistsById(_id: string): Promise<TBooking | null>;
}
