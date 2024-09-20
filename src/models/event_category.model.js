import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class EventCategory extends Model {
    // Método para crear una nueva relación entre evento y categoría
    static async createEventCategory(eventCategory) {
        try {
            return await this.create(eventCategory);
        } catch (error) {
            console.error(`Unable to create event-category association: ${error}`);
            throw new Error("Cannot create event-category association");
        }
    }

    // Método para obtener todas las relaciones entre eventos y categorías
    static async getEventCategories() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all event-category associations: ${error}`);
            throw error;
        }
    }

    // Método para obtener una relación entre evento y categoría por IDs
    static async getEventCategoryByIds(event_id, category_id) {
        try {
            return await this.findOne({
                where: { event_id, category_id }
            });
        } catch (error) {
            console.error(`Unable to find event-category association by ids: ${error}`);
            throw error;
        }
    }

    // Método para actualizar una relación entre evento y categoría
    static async updateEventCategory(event_id, category_id, updated_eventCategory) {
        try {
            const eventCategory = await this.findOne({
                where: { event_id, category_id }
            });
            return eventCategory.update(updated_eventCategory);
        } catch (error) {
            console.error(`Unable to update the event-category association: ${error}`);
            throw error;
        }
    }

    // Método para eliminar una relación entre evento y categoría
    static async deleteEventCategory(event_id, category_id) {
        try {
            const eventCategory = await this.findOne({
                where: { event_id, category_id }
            });
            return eventCategory.destroy();
        } catch (error) {
            console.error(`Unable to delete event-category association: ${error}`);
            throw error;
        }
    }
}

EventCategory.init({
    event_id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    }
}, {
    sequelize,
    tableName: 'event_categories',
    timestamps: false
});

export { EventCategory };
