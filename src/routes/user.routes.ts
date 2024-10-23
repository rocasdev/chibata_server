import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class UserRoutes {
  private router: Router;
  private userController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.userController = UserController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/me",
      this.authMiddleware.isAuthenticated,
      this.userController.getLoggedUser
    );
    this.router.get(
      "/",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.userController.getUsers
    );
    this.router.get(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.userController.getUser
    );
    this.router.get(
      "/:id/organizations",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.userController.getUserOrganization
    )
    this.router.post(
      "/",
      this.userController.postUser
    );
    this.router.put(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.userController.putUser
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new UserRoutes();
