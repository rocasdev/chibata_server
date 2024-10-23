import { Router } from "express";
import NotificationController from "../controllers/notification.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class NotificationRoutes {
  private router: Router;
  private notificationController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.notificationController = NotificationController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/own",
      this.authMiddleware.isAuthenticated,
      this.notificationController.getUserNotifications
    );
    this.router.get(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.notificationController.getNotification
    );
    this.router.patch(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.notificationController.markNotificationAsRead
    );
    this.router.delete(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.notificationController.deleteNotification
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new NotificationRoutes();
