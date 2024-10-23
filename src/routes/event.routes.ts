import { Router } from "express";
import EventController from "../controllers/event.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class EventRoutes {
  private router: Router;
  private eventController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = EventController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/create",
      this.authMiddleware.isAuthenticated,
      this.eventController.createEvent
    );
    this.router.get("/", this.eventController.getEvents);
    this.router.get("/:id", this.eventController.getEvent);
    this.router.put(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.updateEvent
    );
    this.router.patch(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.toggleEventState
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new EventRoutes();