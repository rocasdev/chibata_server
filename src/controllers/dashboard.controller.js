

import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import dotenv from "dotenv";
import "../models/associations.js";
import { Event } from "../models/event.model.js";
import { Organization } from "../models/organization.model.js";

dotenv.config();

class DashboardController {
  static async getUserNotifications(req, res) {
    // Cambiar `req.params.page` por `req.query.page`
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const userId = req.logged_user.id;

    try {
      const notifications = await Notification.findAll({
        where: { user_id: userId },
        limit: pageSize,
        offset,
        order: [["created_at", "DESC"]],
      });

      const totalCount = await Notification.count({
        where: { user_id: userId },
      });
      const totalPages = Math.ceil(totalCount / pageSize);

      res.status(200).json({ notifications, totalPages });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las notificaciones: " + error });
    }
  }

  static async getNotification(req, res) {
    const noti_id = req.params.id;

    try {
      const notification = await Notification.findByPk(noti_id);

      res.status(200).json({ notification });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error al obtener las notificaciones: " + error });
    }
  }

  static async toggleReadState(req, res) {
    const noti_id = req.params.id;

    try {
      const notification = await Notification.findByPk(noti_id);

      if (!notification) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }

      // Alternar el estado de lectura
      notification.is_read = !notification.is_read;

      // Guardar los cambios
      await notification.save();

      res.status(200).json({ notification });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error al alternar el estado de lectura: " + error });
    }
  }

  static async deleteNotification(req, res) {
    const noti_id = req.params.id;

    try {
      const notification = await Notification.findByPk(noti_id);

      if (!notification) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }

      // Eliminar la notificación
      await notification.destroy();

      res.status(200).json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error al eliminar la notificación: " + error });
    }
  }

  static async getCounts(req, res) {
    try {
      const user_count = await User.count();
      const events_count = await Event.count();
      const organizations_count = await Organization.count();
      const data = {
        user_count,
        events_count,
        organizations_count,
      };
      return res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los counts: " + error });
      console.error(error);
      throw error;
    }
  }
}

export default DashboardController;
