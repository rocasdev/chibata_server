// Import necessary modules
import express, { Express } from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import { EXS_SECRET_KEY, NODE_ENV } from "./config/constants";
import helmet from "helmet";

// Import routes
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import DashboardRoutes from "./routes/dashboard.routes";
import NotificationRoutes from "./routes/notification.routes";
import CategoryRoutes from "./routes/category.routes";
import OrganizationRoutes from "./routes/organization.routes";
import EventRoutes from "./routes/event.routes";
import OrganizerRoutes from "./routes/organizer.routes";

const app: Express = express();

setupMiddlewares(app);
setupRoutes(app);

export default app;

function setupMiddlewares(app: Express) {
  app.use(fileUpload());
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "https://chibataclientv1-production.up.railway.app", // Dominio del cliente
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Métodos HTTP permitidos
      credentials: true,
    })
  );
  app.use(
    session({
      secret: EXS_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    })
  );
  app.use(morgan("dev"));
  app.use(helmet());
}

function setupRoutes(app: Express) {
  app.use("/api/users", UserRoutes.getRouter());
  app.use("/api/auth", AuthRoutes.getRouter());
  app.use("/api/dashboard", DashboardRoutes.getRouter());
  app.use("/api/notifications", NotificationRoutes.getRouter());
  app.use("/api/categories", CategoryRoutes.getRouter());
  app.use("/api/organizations", OrganizationRoutes.getRouter());
  app.use("/api/events", EventRoutes.getRouter());
  app.use("/api/organizer", OrganizerRoutes.getRouter());
}
