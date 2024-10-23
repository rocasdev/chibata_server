import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class DashboardRoutes {
  private router: Router;
  private dashboardController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.dashboardController = dashboardController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/counts",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.dashboardController.getDashboardCounts
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new DashboardRoutes();
