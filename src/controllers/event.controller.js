import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import { OrganizationMember } from "../models/orgnazation_member.model.js";

class EventController {
  static async getEvents(req, res) {
    const page = parseInt(req.query.page) || 1; // Número de página, por defecto 1
    const limit = parseInt(req.query.limit) || 10; // Límite de eventos por página, por defecto 10
    const offset = (page - 1) * limit; // Calcular el offset

    try {
      // Obtener los eventos con paginación y relaciones
      const { count, rows: events } = await Event.findAndCountAll({
        limit: limit,
        order: [["event_id", "DESC"]],
        offset: offset,
        include: [
          {
            model: User, // Suponiendo que tienes un modelo User para los organizadores
            attributes: ["name", "surname"], // Solo trae el nombre del organizador
            as: "organizer",
          },
          {
            model: Organization, // Suponiendo que tienes un modelo Organization
            attributes: ["organization_name"],
            as: "organization",
          },
        ],
      });

      // Calcular el total de páginas
      const totalPages = Math.ceil(count / limit);

      // Mapear los resultados para devolver la estructura deseada
      const formattedEvents = events.map((event) => ({
        event_id: event.event_id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        status: event.status,
        state: event.state,
        created_at: event.created_at,
        updated_at: event.updated_at,
        organizer:
          event.organizer?.name + " " + event.organizer?.surname ||
          "Sin organizador", // Devolver solo el nombre
        organization:
          event.organization?.organization_name || "Sin organización", // Devolver solo el nombre
      }));

      // Enviar la respuesta con eventos, total de páginas y página actual
      res.status(200).json({
        events: formattedEvents,
        currentPage: page,
        totalPages: totalPages,
        totalEvents: count,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los eventos: " + error.message });
    }
  }

  static async getEvent(req, res) {
    try {
      const id = req.params.id;

      // Obtener el evento junto con los datos del organizador y la organización
      const event = await Event.findByPk(id, {
        include: [
          {
            model: User, // Suponiendo que tienes un modelo User para los organizadores
            attributes: ["name", "surname"], // Solo trae el nombre y apellido del organizador
            as: "organizer", // Alias para la relación
          },
          {
            model: Organization, // Suponiendo que tienes un modelo Organization
            attributes: ["organization_name"], // Solo trae el nombre de la organización
            as: "organization",
          },
        ],
      });

      if (!event) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }

      // Formatear los datos para devolver la misma estructura que en findAndCountAll
      const formattedEvent = {
        event_id: event.event_id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        status: event.status,
        state: event.state,
        created_at: event.created_at,
        updated_at: event.updated_at,
        organizer:
          event.organizer?.name + " " + event.organizer?.surname ||
          "Sin organizador", // Devuelve el nombre completo del organizador
        organization:
          event.organization?.organization_name || "Sin organización", // Devuelve solo el nombre de la organización
      };

      // Enviar la respuesta con los datos formateados del evento
      res.status(200).json({ event: formattedEvent });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener el evento: " + error.message });
    }
  }

  static async postEvent(req, res) {
    try {
      const { title, description, date, time, status, state } = req.body;
      const loggedUserId = req.logged_user.id; // ID del usuario desde el middleware

      // Consulta para obtener el organization_id a partir del organizer_id
      const organizationMember = await OrganizationMember.findOne({
        where: { user_id: loggedUserId },
      });

      if (!organizationMember) {
        return res.status(404).json({ message: "Organizador no encontrado" });
      }

      const { organization_id } = organizationMember; // Asegúrate de que esta sea la propiedad correcta

      const eventData = {
        title,
        description,
        date,
        time,
        status,
        state,
        organizer_id: loggedUserId, // Asignar el ID del organizador
        organization_id: organization_id, // Asignar el ID de la organización
      };

      await Event.create(eventData);
      res.status(200).json({ message: "Evento creado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear el evento: " + error.message });
    }
  }

  static async putEvent(req, res) {
    try {
      const id = req.params.id; // Obtén el ID del evento de los parámetros de la ruta
      const eventData = req.body; // Obtén los datos del evento del cuerpo de la solicitud
      console.log("Datos recibidos para actualizar:", eventData);
      // Valida que el evento existe
      const event = await Event.findOne({ where: { event_id: id } });
      if (!event) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }

      // Actualiza el evento en la base de datos
      await Event.update(eventData, { where: { event_id: id } });
      res.status(200).json({ message: "Evento actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar el evento: " + error.message });
    }
  }

  static async toggleEventStatus(req, res) {
    try {
      const eventId = req.params.id;

      // Busca el evento por su ID
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }

      // Alternar el estado del evento
      event.state = !event.state;

      // Guardar los cambios en la base de datos
      await event.save();

      // Devolver el evento actualizado
      res.status(200).json({ message: "Estado del evento actualizado", event });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error al actualizar el estado del evento: " + error.message,
        });
    }
  }
}

export default EventController;
