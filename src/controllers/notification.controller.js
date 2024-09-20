import { Notification } from '../models/notification.model.js';

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const notifications = await Notification.findAll();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las notificaciones: ' + error });
    }
  }

  static async getNotification(req, res) {
    try {
      const id = req.params.id;
      const notification = await Notification.findByPk(id);
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la notificación: ' + error });
    }
  }

  static async postNotification(req, res) {
    try {
      const notificationData = req.body;
      await Notification.create(notificationData);
      res.status(200).json({ message: 'Notificación creada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la notificación: ' + error });
    }
  }

  static async putNotification(req, res) {
    try {
      const id = req.params.id;
      const notificationData = req.body;
      await Notification.update(notificationData, { where: { notification_id: id } });
      res.status(200).json({ message: 'Notificación actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la notificación: ' + error });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const id = req.params.id;
      await Notification.destroy({ where: { notification_id: id } });
      res.status(200).json({ message: 'Notificación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la notificación: ' + error });
    }
  }
}

export default NotificationController;
