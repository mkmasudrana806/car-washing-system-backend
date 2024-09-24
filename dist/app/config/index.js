"use strict";
// import dotenv from "dotenv";
// import path from "path";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config({ path: path.join(process.cwd(), ".env") });
// export default {
//   node_env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
//   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
//   default_password: process.env.DEFAULT_PASS,
//   jwt_access_secret: process.env.JWT_ACCESS_SECRET,
//   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
//   jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
//   jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
// };
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// By default, config will look for a file called `.env` in the current working directory.
// as this file and `.env` files are not in the same directory, we need to specify the `.env` path
const result = dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const config = {
    app_port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    default_password: process.env.DEFAULT_PASSWORD,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    node_environment: process.env.NODE_ENVIRONMENT,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    node_mailer_user: process.env.NODE_MAILER_USER,
    node_mailer_password: process.env.NODE_MAILER_PASSWORD,
    reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_secret_key: process.env.CLOUDINARY_SECRET_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};
exports.default = config;
// config will read your .env file, parse the contents, assign it to process.env, and return an Object with a parsed key containing the loaded content or an error key if it failed.
if (result.error) {
    console.log("error while parsing environment variable: ", result.error);
}
