import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Category extends Model {
    // Método para crear una nueva categoría
    static async createCategory(category) {
        try {
            return await this.create(category);
        } catch (error) {
            console.error(`Unable to create category: ${error}`);
            throw new Error("Cannot create category");
        }
    }

    // Método para obtener todas las categorías
    static async getCategories() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all categories: ${error}`);
            throw error;
        }
    }

    // Método para obtener una categoría por su ID
    static async getCategoryById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find category by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar una categoría
    static async updateCategory(id, updated_category) {
        try {
            const category = await this.findByPk(id);
            return category.update(updated_category);
        } catch (error) {
            console.error(`Unable to update the category: ${error}`);
            throw error;
        }
    }

    // Método para alternar el estado de una categoría
    static async toggleCategoryState(id) {
        try {
            const category = await this.findByPk(id);
            const newState = !category.state;
            await category.update({ state: newState });
            return category;
        } catch (error) {
            console.error(`Unable to toggle category state: ${error}`);
            throw error;
        }
    }
}

Category.init({
    category_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'categories',
    timestamps: false
});

export { Category };
