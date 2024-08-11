import { Model } from "mongoose";
import { USER_ROLE } from "../auth/auth.constant";

// type for user
export type TUser = {
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  phone: string;
  role: "user" | "admin";
  address: string;
  isDeleted: boolean;
};

// user role type
export type TUserRole = keyof typeof USER_ROLE;

// user model
export interface IUserModel extends Model<TUser> {
  isUserExistsByemail(email: string): Promise<TUser | null>;

  isPasswordMatched(
    plainPassword: string,
    hashPassword: string
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedtimestamp: number
  ): boolean;
}
