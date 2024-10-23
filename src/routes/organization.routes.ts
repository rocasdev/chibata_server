import { Router } from "express";
import OrganizationController from "../controllers/organization.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class OrganizationRoutes {
  private router: Router;
  private organizationController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.organizationController = OrganizationController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all organizations
    this.router.get(
      "/",
      this.authMiddleware.isAuthenticated,
      this.organizationController.getOrganizations
    );

    // Get a specific organization
    this.router.get(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.organizationController.getOrganization
    );

    // Create a new organization
    this.router.post(
      "/",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.organizationController.postOrganization
    );

    // Update an organization
    this.router.put(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.organizationController.putOrganization
    );

    // Delete an organization
    this.router.delete(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.organizationController.deleteOrganization
    );

    // Add a member to an organization
    this.router.post(
      "/:id/members",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.organizationController.addMember
    );

    // Remove a member from an organization
    this.router.delete(
      "/:id/members",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.organizationController.removeMember
    );

    // Get members of an organization
    this.router.get(
      "/:id/members",
      this.authMiddleware.isAuthenticated,
      this.organizationController.getMembers
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new OrganizationRoutes();