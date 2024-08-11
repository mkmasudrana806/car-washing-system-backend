import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

//middleware: client -> route -> auth -> zod validation -> controller -> service
// auth middleware to verify jweToken
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    // check if the token is sent from the client
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, as token is not given"
      );
    }

    // split the token and exclude 'Bearer' from the token and take only token part
    token = token.split(" ")[1];

    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { email, role, iat } = decoded;

    // check if the user is exists
    const user = await User.isUserExistsByemail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
    }

    // check if the user is already deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, your token is invalid!"
      );
    }

    // check if the user is authorized access
    if (requiredRoles.length > 0 && !requiredRoles?.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, as required role is not matches"
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
