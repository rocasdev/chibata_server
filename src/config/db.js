import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
        timezone: '-05:00',
        dateStrings: true,
    },
    debug: true,
    pool: {
        max: 100,      // Número máximo de conexiones en el pool
        min: 10,       // Número mínimo de conexiones en el pool
    }
})