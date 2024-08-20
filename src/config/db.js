import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: '-05:00', // Zona horaria de Bogotá
    logging: true,
    pool: {
        max: 100,      // Número máximo de conexiones en el pool
        min: 10,       // Número mínimo de conexiones en el pool
        acquire: 60000, // Tiempo máximo que Sequelize intentará obtener una conexión antes de lanzar un error (en milisegundos)
        idle: 10000    // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada (en milisegundos)
    },
    define: {
        timestamps: true,
        underscored: true
    }
})