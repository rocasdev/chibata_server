import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

class CategoryController {
  async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.findAllCategories();
      res.status(200).json({
        message: "Categorías recuperadas exitosamente",
        categories: categories,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all categories:", err);
      res.status(500).json({
        message: `Error interno al traer las categorías: ${err.message}`,
      });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const category = await CategoryService.findCategoryById(id);
      res.status(200).json({
        message: "Categoría recuperada exitosamente",
        category: category,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find category by id:", err);
      res.status(500).json({
        message: `Error interno al traer la categoría: ${err.message}`,
      });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body;
      const newCategory = await CategoryService.createCategory(categoryData);
      res.status(201).json({
        message: "Categoría creada exitosamente",
        category: newCategory,
      });
    } catch (err: any) {
      console.error("Controller | Cannot create category:", err);
      res.status(500).json({
        message: `Error interno al crear la categoría: ${err.message}`,
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const categoryData = req.body;
      const updatedCategory = await CategoryService.updateCategory(
        id,
        categoryData
      );
      res.status(200).json({
        message: "Categoría actualizada exitosamente",
        category: updatedCategory,
      });
    } catch (err: any) {
      console.error("Controller | Cannot update category:", err);
      res.status(500).json({
        message: `Error interno al actualizar la categoría: ${err.message}`,
      });
    }
  }

  async toggleCategoryState(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const updatedCategory = await CategoryService.toggleCategoryState(id);
      res.status(200).json({
        message: "Estado de la categoría cambiado exitosamente",
        category: updatedCategory,
      });
    } catch (err: any) {
      console.error("Controller | Cannot toggle category state:", err);
      res.status(500).json({
        message: `Error interno al cambiar el estado de la categoría: ${err.message}`,
      });
    }
  }
}

export default new CategoryController();
