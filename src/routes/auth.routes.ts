import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRoutes {
  private router: Router;
  private authController;

  constructor() {
    this.router = Router();
    this.authController = AuthController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/login", this.authController.login);
    this.router.post("/register-volunteer", this.authController.registerVolunteer);
    this.router.post("/register-organization", this.authController.registerOrganization);
    this.router.post("/logout", this.authController.logout);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AuthRoutes();
