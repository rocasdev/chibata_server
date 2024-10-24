import { Router } from "express";
import OrganizationController from "../controllers/organization.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import EventController from "../controllers/event.controller";

class OrganizerRoutes {
  private router: Router;
  private organizationController;
  private eventController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.organizationController = OrganizationController;
    this.eventController = EventController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/myorg",
      this.authMiddleware.isAuthenticated,
      this.organizationController.getOrganizationByLoggedMember
    );

    this.router.get(
      "/myevents",
      this.authMiddleware.isAuthenticated,
      this.eventController.getEventsByLoggedUser
    );

    this.router.post(
      "/create-event",
      this.authMiddleware.isAuthenticated,
      this.eventController.createEventByLoggedUser
    )
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new OrganizerRoutes();
