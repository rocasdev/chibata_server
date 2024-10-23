import { Notification, NotificationAttributes } from "../models/notification.model";
import { sequelize } from "../db/db";
import { Sequelize } from "sequelize";

class NotificationService {
  constructor() {
    console.log("NotificationService instance created");
  }
  static async findAllNotifications() {
    try {
      const notifications = await Notification.findAll({
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("notification_id")), "notification_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
          ],
        },
      });
      return notifications;
    } catch (err: any) {
      console.error("Cannot find all notifications:", err);
      throw new Error(`Error fetching all notifications: ${err.message}`);
    }
  }

  static async findNotificationById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const notification = await Notification.findByPk(oid, {
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("notification_id")), "notification_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
          ],
        },
      });
      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }
      return notification;
    } catch (err: any) {
      console.error("Cannot find notification by id:", err);
      throw new Error(`Error fetching notification by ID: ${err.message}`);
    }
  }

  static async updateNotification(id: string, notificationData: Partial<NotificationAttributes>) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const notification = await Notification.findByPk(oid, { transaction: t });
      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }
      await notification.update(notificationData, { transaction: t });
      await t.commit();
      return notification;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update notification:", err);
      throw new Error(`Error updating notification: ${err.message}`);
    }
  }

  static async markNotificationAsRead(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const notification = await Notification.findByPk(oid, { transaction: t });
      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }
      notification.is_read = !notification.is_read;
      await notification.save({ transaction: t });
      await t.commit();
      return notification;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot mark notification as read:", err);
      throw new Error(`Error marking notification as read: ${err.message}`);
    }
  }

  static async findNotificationsByUserId(userId: string, page: number = 1, limit: number = 10) {
    try {
      const uid = Buffer.from(userId, "hex");
      const offset = (page - 1) * limit;
  
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: { user_id: uid },
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("notification_id")), "notification_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
          ],
        },
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });
  
      const totalPages = Math.ceil(count / limit);
  
      return {
        notifications,
        currentPage: page,
        totalPages,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find notifications by user id:", err);
      throw new Error(`Error fetching notifications by user ID: ${err.message}`);
    }
  }

  static async deleteNotification(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const notification = await Notification.findByPk(oid, { transaction: t });
      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }
      await notification.destroy({ transaction: t });
      await t.commit();
      return notification;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot delete notification:", err);
      throw new Error(`Error deleting notification: ${err.message}`);
    }
  }
}

export { NotificationService };