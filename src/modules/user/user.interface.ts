import { Model } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

// user type
export type TUser = {
  name: TUserName;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  age: number;
  gender: "male" | "female" | "others";
  contact: string;
  address: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  profileImg?: string;
  isDeleted: boolean;
};

// statics methods to check isPasswordMatch
export interface IUser extends Model<TUser> {
  isUserExistsByemail(email: string): Promise<TUser | null>;

  isUserExistsById(_id: string): Promise<TUser | null>;

  isPasswordMatch(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  //check if the jwt issued before password change
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedtimestamp: number
  ): boolean;
}
