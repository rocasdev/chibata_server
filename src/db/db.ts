import { Sequelize } from "sequelize";
import {
  DB_URI
} from "../config/constants";

export const sequelize = new Sequelize(DB_URI, {
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
