import { Sequelize } from "sequelize";
import {
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from "../config/constants";

export const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: {
    charset: "utf8",
    dateStrings: true,
  },
  timezone: "-05:00",
  logging: console.log,
});
