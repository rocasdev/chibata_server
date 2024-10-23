import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class CategoryRoutes {
  private router: Router;
  private categoryController;
  private authMiddleware;

  constructor() {
    this.router = Router();
    this.categoryController = CategoryController;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.authMiddleware.isAuthenticated,
      this.categoryController.getCategories
    );

    this.router.get(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.categoryController.getCategory
    );

    this.router.post(
      "/",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.categoryController.createCategory
    );

    this.router.put(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.categoryController.updateCategory
    );

    this.router.patch(
      "/:id",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.categoryController.toggleCategoryState
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new CategoryRoutes();