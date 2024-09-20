import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Notification extends Model {
    // Método para crear una nueva notificación
    static async createNotification(notification) {
        try {
            return await this.create(notification);
        } catch (error) {
            console.error(`Unable to create notification: ${error}`);
            throw new Error("Cannot create notification");
        }
    }

    // Método para obtener todas las notificaciones
    static async getNotifications() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all notifications: ${error}`);
            throw error;
        }
    }

    // Método para obtener una notificación por su ID
    static async getNotificationById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find notification by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar una notificación
    static async updateNotification(id, updated_notification) {
        try {
            const notification = await this.findByPk(id);
            return notification.update(updated_notification);
        } catch (error) {
            console.error(`Unable to update the notification: ${error}`);
            throw error;
        }
    }

    // Método para marcar una notificación como leída o no leída
    static async toggleNotificationReadState(id) {
        try {
            const notification = await this.findByPk(id);
            const newState = !notification.is_read;
            await notification.update({ is_read: newState });
            return notification;
        } catch (error) {
            console.error(`Unable to toggle notification read state: ${error}`);
            throw error;
        }
    }
}

Notification.init({
    notification_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    underscored: true
});

export { Notification };
