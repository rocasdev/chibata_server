import {
  Category,
  CategoryAttributes,
  CategoryCreationAttributes,
} from "../models/category.model";
import { sequelize } from "../db/db";
import { Sequelize } from "sequelize";
import ObjectID from "bson-objectid";

class CategoryService {
  constructor() {
    console.log("CategoryService instance created");
  }

  static async createCategory(categoryData: CategoryCreationAttributes) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      const category = Category.build({ ...categoryData, category_id: oid });
      const newCategory = await category.save({ transaction: t });
      await t.commit();
      return newCategory;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create category:", err);
      throw new Error(`Error creating category: ${err.message}`);
    }
  }

  static async findAllCategories() {
    try {
      const categories = await Category.findAll({
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
      });
      return categories;
    } catch (err: any) {
      console.error("Cannot find all categories:", err);
      throw new Error(`Error fetching all categories: ${err.message}`);
    }
  }

  static async findCategoryById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const category = await Category.findByPk(oid, {
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
      });
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }
      return category;
    } catch (err: any) {
      console.error("Cannot find category by id:", err);
      throw new Error(`Error fetching category by ID: ${err.message}`);
    }
  }

  static async updateCategory(
    id: string,
    categoryData: Partial<CategoryAttributes>
  ) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const category = await Category.findByPk(oid, { transaction: t });
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }
      await category.update(categoryData, { transaction: t });
      await t.commit();
      return category;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update category:", err);
      throw new Error(`Error updating category: ${err.message}`);
    }
  }

  static async toggleCategoryState(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const category = await Category.findByPk(oid, { transaction: t });
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }
      category.is_active = !category.is_active;
      await category.save({ transaction: t });
      await t.commit();
      return category;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot toggle category state:", err);
      throw new Error(`Error toggling category state: ${err.message}`);
    }
  }
}

export { CategoryService };
