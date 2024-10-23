import app from "./app";
import { sequelize } from "./db/db";
import './models/relations'
import "./hooks";
import { PORT } from "./config/constants";

async function startServer() {
    try {
        await syncDatabase();
        app.listen(PORT, () => {
            console.log(`App running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

async function syncDatabase() {
    try {
        console.log("Synchronizing database models...");
        await sequelize.sync();
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Error during database synchronization:", error);
        throw error;
    }
}

startServer();