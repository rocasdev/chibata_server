import dotenv from "dotenv";

dotenv.config();

// APP CONSTANTS
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE;

// DATABASE CONSTANTS
const DB_USER: string = process.env.DB_USER || "";
const DB_PASS: string = process.env.DB_PASS || "";
const DB_SCHEMA: string = process.env.DB_SCHEMA || "";
const DB_HOST: string = process.env.DB_HOST || "";
const DB_PORT: number = parseInt(process.env.DB_PORT || "3306", 10);

// CLOUDINARY CONSTANTS
const CDY_CLOUD_NAME: string = process.env.CDY_CLOUD_NAME || "";
const CDY_API_SECRET: string = process.env.CDY_API_SECRET || "";
const CDY_API_KEY: string = process.env.CDY_API_KEY || "";

// EXPRESS SESSION CONSTANTS
const EXS_SECRET_KEY: string = process.env.EXS_SECRET_KEY || "";

// BCRYPT SALT CONSTANTS
const BPT_SALT: number = parseInt(process.env.BPT_SALT || "10", 10);

export {
  PORT,
  DB_USER,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_SCHEMA,
  CDY_API_KEY,
  CDY_CLOUD_NAME,
  CDY_API_SECRET,
  EXS_SECRET_KEY,
  NODE_ENV,
  BPT_SALT,
};
