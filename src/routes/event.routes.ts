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
      "/",
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
    this.router.get(
      "/category/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.getEventsByCategory
    );
    this.router.post(
      "/enroll/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.volunteerRegistration
    );
    this.router.get(
      "/date",
      this.authMiddleware.isAuthenticated,
      this.eventController.getEventsByDate
    );
    this.router.get(
      "/is-enroll/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.validateUserIsEnrollInEvent
    );
    this.router.get(
      "/enrolls/:id",
      this.authMiddleware.isAuthenticated,
      this.eventController.getRegistrationsByEvent
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new EventRoutes();
