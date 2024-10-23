import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

class NotificationController {
  async getNotifications(_req: Request, res: Response): Promise<void> {
    try {
      const notifications = await NotificationService.findAllNotifications();
      res.status(200).json({
        message: "Notificaciones recuperadas exitosamente",
        notifications: notifications,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all notifications:", err);
      res.status(500).json({
        message: `Error interno al traer las notificaciones: ${err.message}`,
      });
    }
  }

  async getNotification(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const notification = await NotificationService.findNotificationById(id);
      res.status(200).json({
        message: "Notificación recuperada exitosamente",
        notification: notification,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find notification by id:", err);
      res.status(500).json({
        message: `Error interno al traer la notificación: ${err.message}`,
      });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const notificationData = req.body;
      const updatedNotification = await NotificationService.updateNotification(
        id,
        notificationData
      );
      res.status(200).json({
        message: "Notificación actualizada exitosamente",
        notification: updatedNotification,
      });
    } catch (err: any) {
      console.error("Controller | Cannot update notification:", err);
      res.status(500).json({
        message: `Error interno al actualizar la notificación: ${err.message}`,
      });
    }
  }

  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const updatedNotification =
        await NotificationService.markNotificationAsRead(id);
      res.status(200).json({
        message: "Notificación marcada como leída exitosamente",
        notification: updatedNotification,
      });
    } catch (err: any) {
      console.error("Controller | Cannot mark notification as read:", err);
      res.status(500).json({
        message: `Error interno al marcar la notificación como leída: ${err.message}`,
      });
    }
  }

  async getUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.session.user_id || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const notifications = await NotificationService.findNotificationsByUserId(
        userId,
        page,
        limit
      );
      res.status(200).json({
        message: "Notificaciones del usuario recuperadas exitosamente",
        notifications: notifications.notifications,
        totalPages: notifications.totalPages,
        currentPage: notifications.currentPage,
        totalItems: notifications.totalItems,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find notifications by user id:", err);
      res.status(500).json({
        message: `Error interno al traer las notificaciones del usuario: ${err.message}`,
      });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await NotificationService.deleteNotification(id);
      res.status(200).json({
        message: "Notificación eliminada exitosamente",
      });
    } catch (err: any) {
      console.error("Controller | Cannot delete notification:", err);
      res.status(500).json({
        message: `Error interno al eliminar la notificación: ${err.message}`,
      });
    }
  }
}

export default new NotificationController();
