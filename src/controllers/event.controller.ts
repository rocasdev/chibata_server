import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import {
  EventCreationAttributes,
  EventAttributes,
} from "../models/event.model";
import { UploadedFile } from "express-fileupload";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/upload_image.util";
import { generateSlug } from "../utils/slug.util"; // Asumiendo que tienes una función para generar slugs

class EventController {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const newEvent: EventCreationAttributes = {
        title: data.title,
        description: data.description,
        slug: generateSlug(data.title), // Genera un slug basado en el título
        date_time: data.date_time,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        banner: "",
        relative_banner_url: "",
        organizer_id: Buffer.from(data.organizer_id, "hex"),
        organization_id: Buffer.from(data.organization_id, "hex"),
        category_id: Buffer.from(data.category_id, "hex"),
        status: data.status || "Programado",
        is_active: data.is_active ?? true,
      };

      if (req.files && req.files.banner) {
        const banner_file = req.files.banner as UploadedFile;

        try {
          const result: any = await uploadImageToCloudinary(
            banner_file.data,
            "event_banner"
          );
          newEvent.banner = result.secure_url;
          newEvent.relative_banner_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir el banner del evento" });
          return;
        }
      }

      const createdEvent = await EventService.createEvent(newEvent);

      res.status(201).json({
        message: "Evento creado correctamente",
        event: createdEvent,
      });
    } catch (err: any) {
      console.error("Controller | Cannot create event: ", err);
      res.status(500).json({
        message: `Error interno al crear el evento: ${err.message}`,
      });
    }
  }

  async createEventByLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const newEvent: Omit<
        EventCreationAttributes,
        "organizer_id" | "organization_id"
      > = {
        title: data.title,
        description: data.description,
        slug: generateSlug(data.title), // Genera un slug basado en el título
        date_time: data.date_time,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        banner: "",
        relative_banner_url: "",
        category_id: Buffer.from(data.category_id, "hex"),
        status: data.status || "Programado",
        is_active: data.is_active ?? true,
      };

      if (req.files && req.files.banner) {
        const banner_file = req.files.banner as UploadedFile;

        try {
          const result: any = await uploadImageToCloudinary(
            banner_file.data,
            "event_banner"
          );
          newEvent.banner = result.secure_url;
          newEvent.relative_banner_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir el banner del evento" });
          return;
        }
      }

      const userId = req.session.user_id;

      if (!userId) {
        res.status(500).json({
          message: "No se pudo crear el evento, no hay usuario logueado.",
        });
        throw new Error("No se pudo crear el evento, no hay usuario logueado.");
      }

      const createdEvent = await EventService.createEventWithUser(
        newEvent,
        userId
      );

      res.status(201).json({
        message: "Evento creado correctamente",
        event: createdEvent,
      });
    } catch (err: any) {
      console.error("Controller | Cannot create event: ", err);
      res.status(500).json({
        message: `Error interno al crear el evento: ${err.message}`,
      });
    }
  }

  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const events = await EventService.findAllEvents(page, limit);
      res.status(200).json({
        message: "Eventos recuperados exitosamente",
        events: events.events,
        totalPages: events.totalPages,
        currentPage: events.currentPage,
        totalItems: events.totalItems,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all events:", err);
      res.status(500).json({
        message: `Error interno al traer los eventos: ${err.message}`,
      });
    }
  }

  async getEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const event = await EventService.findEventById(id);
      if (!event) {
        res.status(404).json({ message: "Evento no encontrado" });
        return;
      }
      res.status(200).json({
        message: "Evento recuperado exitosamente",
        event: event,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find event by id:", err);
      res.status(500).json({
        message: `Error interno al traer el evento: ${err.message}`,
      });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const data = req.body;

      const existingEvent = await EventService.findEventById(eventId);
      if (!existingEvent) {
        res.status(404).json({ message: "Evento no encontrado" });
        return;
      }

      const updatedEvent: Partial<EventAttributes> = {
        title: data.title || existingEvent.title,
        description: data.description || existingEvent.description,
        slug: data.title ? generateSlug(data.title) : existingEvent.slug,
        date_time: data.date_time
          ? new Date(data.date_time)
          : existingEvent.date_time,
        address: data.address || existingEvent.address,
        latitude: data.latitude
          ? parseFloat(data.latitude)
          : existingEvent.latitude,
        longitude: data.longitude
          ? parseFloat(data.longitude)
          : existingEvent.longitude,
        organizer_id: data.organizer_id
          ? Buffer.from(data.organizer_id, "hex")
          : existingEvent.organizer_id,
        organization_id: data.organization_id
          ? Buffer.from(data.organization_id, "hex")
          : existingEvent.organization_id,
        category_id: data.category_id
          ? Buffer.from(data.category_id, "hex")
          : existingEvent.category_id,
        status: data.status || existingEvent.status,
        is_active:
          data.is_active !== undefined
            ? data.is_active
            : existingEvent.is_active,
        banner: existingEvent.banner,
        relative_banner_url: existingEvent.relative_banner_url,
      };

      if (req.files && req.files.banner) {
        const banner_file = req.files.banner as UploadedFile;

        try {
          if (existingEvent.relative_banner_url) {
            await deleteImageFromCloudinary(existingEvent.relative_banner_url);
          }

          const result: any = await uploadImageToCloudinary(
            banner_file.data,
            "event_banner"
          );

          updatedEvent.banner = result.secure_url;
          updatedEvent.relative_banner_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir el nuevo banner del evento" });
          return;
        }
      }

      await EventService.updateEvent(eventId, updatedEvent);

      res.status(200).json({ message: "Evento actualizado correctamente" });
    } catch (err: any) {
      console.error("Controller | Cannot update event: ", err);
      res.status(500).json({
        message: `Error interno al actualizar el evento: ${err.message}`,
      });
    }
  }

  async toggleEventState(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const updatedEvent = await EventService.toggleEventState(eventId);
      res.status(200).json({
        message: "Estado del evento actualizado correctamente",
        is_active: updatedEvent.is_active,
      });
    } catch (err: any) {
      console.error("Controller | Cannot toggle event state:", err);
      res.status(500).json({
        message: `Error interno al cambiar el estado del evento: ${err.message}`,
      });
    }
  }

  async getEventsByLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.session.user_id;

      if (!userId) {
        res.status(500).json({
          message: "No se pudo traer el evento, no hay usuario logueado.",
        });
        throw new Error("No se pudo traer el evento, no hay usuario logueado.");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const events = await EventService.findEventByOrganizationId(
        userId,
        page,
        limit
      );
      res.status(200).json({
        message: "Eventos recuperados exitosamente",
        events: events.events,
        totalPages: events.totalPages,
        currentPage: events.currentPage,
        totalItems: events.totalItems,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all events:", err);
      res.status(500).json({
        message: `Error interno al traer los eventos: ${err.message}`,
      });
    }
  }

  async getEventsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await EventService.findEventsByCategory(
        categoryId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        events: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve events",
        error: error,
      });
    }
  }

  async volunteerRegistration(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const userId = req.session.user_id;

      if (!userId) {
        res.status(500).json({
          message: "No se pudo registrar el usuario, no hay usuario logueado.",
        });
        throw new Error("No se pudo registrar el usuario, no hay usuario logueado.");
      }

      const event = await EventService.findEventById(eventId);
      if (!event) {
        res.status(404).json({ message: "Evento no encontrado" });
        return;
      }

      const volunteer = await EventService.findOneRegistration(
        eventId,
        userId
      );

      if (volunteer) {
        res.status(400).json({ message: "El usuario ya está registrado" });
        return;
      }

      await EventService.volunteerRegistration(eventId, userId);

      res.status(200).json({ message: "Registro exitoso" });
    } catch (err: any) {
      console.error("Controller | Cannot volunteer for event: ", err);
      res.status(500).json({
        message: `Error interno al registrarse como voluntario: ${err.message}`,
      });
      throw new Error("Error interno al registrarse en el evento como voluntario.");
    }
  }
}

export default new EventController();
