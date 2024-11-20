import {
  Event,
  EventAttributes,
  EventCreationAttributes,
} from "../models/event.model";
import { sequelize } from "../db/db";
import ObjectID from "bson-objectid";
import { Sequelize, Op } from "sequelize";
import { Organization } from "../models/organization.model";
import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { OrganizationMember } from "../models/organization_member.model";
import { EventRegistration } from "../models/event_registration.model";
import { Certificate } from "../models/certificate.model";

class EventService {
  constructor() {
    console.log("EventService instance created");
  }

  static async createEvent(eventData: EventCreationAttributes) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      const event = Event.build({ ...eventData, event_id: oid });
      const newEvent = await event.save({ transaction: t });
      await t.commit();
      return newEvent;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create event:", err);
      throw new Error(`Error creating event: ${err.message}`);
    }
  }

  static async findAllEvents(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: events } = await Event.findAndCountAll({
        attributes: [
          [Sequelize.fn("HEX", Sequelize.col("Event.event_id")), "event_id"],
          "title",
          "description",
          "slug",
          "date_time",
          "address",
          "latitude",
          "longitude",
          "banner",
          "relative_banner_url",
          "status",
          "is_active",
          "max_volunteers",
          "current_volunteers",
          "created_at",
          "updated_at",
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organization_id")),
            "organization_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organizer_id")),
            "organizer_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.category_id")),
            "category_id",
          ],
        ],
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: User,
            attributes: [
              [Sequelize.fn("HEX", Sequelize.col("User.user_id")), "user_id"],
              "firstname",
              "surname",
              "avatar",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
              "is_active",
            ],
          },
        ],
        limit,
        offset,
        order: [["date_time", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      return {
        events,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find all events:", err);
      throw new Error(`Error fetching all events: ${err.message}`);
    }
  }

  static async findEventById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const event = await Event.findByPk(oid, {
        attributes: [
          [Sequelize.fn("HEX", Sequelize.col("Event.event_id")), "event_id"],
          "title",
          "description",
          "slug",
          "date_time",
          "address",
          "latitude",
          "longitude",
          "banner",
          "relative_banner_url",
          "status",
          "is_active",
          "max_volunteers",
          "current_volunteers",
          "created_at",
          "updated_at",
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organization_id")),
            "organization_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organizer_id")),
            "organizer_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.category_id")),
            "category_id",
          ],
        ],
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: User,
            attributes: [
              [Sequelize.fn("HEX", Sequelize.col("User.user_id")), "user_id"],
              "firstname",
              "surname",
              "avatar",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
              "is_active",
            ],
          },
        ],
      });
      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }
      return event;
    } catch (err: any) {
      console.error("Cannot find event by id:", err);
      throw new Error(`Error fetching event by ID: ${err.message}`);
    }
  }

  static async findEventByOrganizationId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const offset = (page - 1) * limit;
      const oid = Buffer.from(userId, "hex");
      const member = await OrganizationMember.findOne({
        where: { member_id: oid },
      });
      const oidOrg = member?.organization_id;
      const { count, rows: events } = await Event.findAndCountAll({
        where: { organization_id: oidOrg },
        attributes: [
          [Sequelize.fn("HEX", Sequelize.col("Event.event_id")), "event_id"],
          "title",
          "description",
          "slug",
          "date_time",
          "address",
          "latitude",
          "longitude",
          "banner",
          "relative_banner_url",
          "status",
          "is_active",
          "max_volunteers",
          "current_volunteers",
          "created_at",
          "updated_at",
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organization_id")),
            "organization_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organizer_id")),
            "organizer_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.category_id")),
            "category_id",
          ],
        ],
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: User,
            attributes: [
              [Sequelize.fn("HEX", Sequelize.col("User.user_id")), "user_id"],
              "firstname",
              "surname",
              "avatar",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
              "is_active",
            ],
          },
        ],
        limit,
        offset,
        order: [["date_time", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      return {
        events,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find events by organization id:", err);
      throw new Error(
        `Error fetching events by organization ID: ${err.message}`
      );
    }
  }

  static async updateEvent(id: string, eventData: Partial<EventAttributes>) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const event = await Event.findByPk(oid, { transaction: t });
      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }
      await event.update(eventData, { transaction: t });
      await t.commit();
      return event;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update event:", err);
      throw new Error(`Error updating event: ${err.message}`);
    }
  }

  static async toggleEventState(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const event = await Event.findByPk(oid, { transaction: t });
      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }
      event.is_active = !event.is_active;
      await event.save({ transaction: t });
      await t.commit();
      return event;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot toggle event state:", err);
      throw new Error(`Error toggling event state: ${err.message}`);
    }
  }

  static async findEventBySlug(slug: string) {
    try {
      const event = await Event.findOne({
        where: { slug },
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
            [
              Sequelize.fn("HEX", Sequelize.col("organizer_id")),
              "organizer_id",
            ],
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
      });
      if (!event) {
        throw new Error(`Event with slug ${slug} not found`);
      }
      return event;
    } catch (err: any) {
      console.error("Cannot find event by slug:", err);
      throw new Error(`Error fetching event by slug: ${err.message}`);
    }
  }

  static async findUpcomingEvents(limit: number = 10) {
    try {
      const events = await Event.findAll({
        where: {
          date_time: {
            [Op.gte]: new Date(),
          },
          status: "Programado",
          is_active: true,
        },
        order: [["date_time", "ASC"]],
        limit,
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
            [
              Sequelize.fn("HEX", Sequelize.col("organizer_id")),
              "organizer_id",
            ],
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
      });
      return events;
    } catch (err: any) {
      console.error("Cannot find upcoming events:", err);
      throw new Error(`Error fetching upcoming events: ${err.message}`);
    }
  }

  static async updateEventStatus(
    id: string,
    status: EventAttributes["status"]
  ) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const event = await Event.findByPk(oid, { transaction: t });
      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }
      event.status = status;
      await event.save({ transaction: t });
      await t.commit();
      return event;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update event status:", err);
      throw new Error(`Error updating event status: ${err.message}`);
    }
  }

  static async countEvents() {
    try {
      const count = await Event.count();
      return count;
    } catch (err: any) {
      console.error("Cannot count events:", err);
      throw new Error(`Error counting events: ${err.message}`);
    }
  }

  static async createEventWithUser(
    eventData: Omit<
      EventCreationAttributes,
      "organizer_id" | "organization_id"
    >,
    userId: string
  ) {
    const t = await sequelize.transaction();
    try {
      const userOid = Buffer.from(userId, "hex");
      const member = await OrganizationMember.findOne({
        where: { member_id: userOid },
      });
      if (!member) throw new Error("No member found with provided user ID");
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      const event = Event.build({
        ...eventData,
        event_id: oid,
        organization_id: member.organization_id,
        organizer_id: member.member_id,
      });
      const newEvent = await event.save({ transaction: t });
      await t.commit();
      return newEvent;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create event:", err);
      throw new Error(`Error creating event: ${err.message}`);
    }
  }

  static async findEventsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const offset = (page - 1) * limit;
      const oid = Buffer.from(categoryId, "hex");

      const { count, rows: events } = await Event.findAndCountAll({
        where: { category_id: oid },
        attributes: [
          [Sequelize.fn("HEX", Sequelize.col("Event.event_id")), "event_id"],
          "title",
          "description",
          "slug",
          "date_time",
          "address",
          "latitude",
          "longitude",
          "banner",
          "relative_banner_url",
          "status",
          "is_active",
          "max_volunteers",
          "current_volunteers",
          "created_at",
          "updated_at",
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organization_id")),
            "organization_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.organizer_id")),
            "organizer_id",
          ],
          [
            Sequelize.fn("HEX", Sequelize.col("Event.category_id")),
            "category_id",
          ],
        ],
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: User,
            attributes: [
              [Sequelize.fn("HEX", Sequelize.col("User.user_id")), "user_id"],
              "firstname",
              "surname",
              "avatar",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
              "is_active",
            ],
          },
        ],
        limit,
        offset,
        order: [["date_time", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      return {
        events,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find events by category:", err);
      throw new Error(`Error fetching events by category: ${err.message}`);
    }
  }

  static async getRegistrationsByEventId(
    eventId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const offset = (page - 1) * limit;
      const oid = Buffer.from(eventId, "hex");
      const { count, rows: registrations } =
        await EventRegistration.findAndCountAll({
          where: { event_id: oid },
          attributes: {
            include: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("EventRegistration.volunteer_id")
                ),
                "volunteer_id",
              ],
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("EventRegistration.event_id")
                ),
                "event_id",
              ],
              "attendance_status",
              "is_certificated",
            ],
          },
          include: [
            {
              model: User,
              attributes: [
                [Sequelize.fn("HEX", Sequelize.col("User.user_id")), "user_id"],
                "firstname",
                "surname",
                "avatar",
              ],
            },
            {
              model: Event,
              attributes: [
                [
                  Sequelize.fn("HEX", Sequelize.col("Event.event_id")),
                  "event_id",
                ],
                "title",
                "max_volunteers",
                "current_volunteers",
                "status",
                "is_active",
              ],
            },
          ],
          limit,
          offset,
          order: [["created_at", "DESC"]],
        });

      const event = await Event.findOne({
        where: { event_id: oid },
        attributes: [
          [Sequelize.fn("HEX", Sequelize.col("Event.event_id")), "event_id"],
          "title",
          "max_volunteers",
          "current_volunteers",
          "status",
          "is_active",
          "description",
          "date_time",
        ],
      });

      const totalPages = Math.ceil(count / limit);

      return {
        registrations,
        event,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find registrations by event id:", err);
      throw new Error(
        `Error fetching registrations by event id: ${err.message}`
      );
    }
  }

  static async findOneRegistration(userId: string, eventId: string) {
    try {
      const oid = Buffer.from(eventId, "hex");
      const userOid = Buffer.from(userId, "hex");
      const registration: any = await EventRegistration.findOne({
        where: { event_id: oid, volunteer_id: userOid },
      });

      return registration;
    } catch (err: any) {
      console.error("Cannot find registration:", err);
      throw new Error(`Error fetching registration: ${err.message}`);
    }
  }

  static async volunteerRegistration(eventId: string, userId: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(eventId, "hex");
      const event = await Event.findByPk(oid, { transaction: t });
      if (!event) {
        throw new Error(`Event with id ${eventId} not found`);
      }
      event.current_volunteers += 1;
      event.save();
      const userOid = Buffer.from(userId, "hex");
      const user = await User.findByPk(userOid, { transaction: t });
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      const registration = await EventRegistration.create(
        {
          attendance_status: "Registrado",
          event_id: oid,
          volunteer_id: userOid,
          is_certificated: false,
        },
        { transaction: t }
      );
      await t.commit();
      return registration;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot register user for event:", err);
      throw new Error(`Error registering user for event: ${err.message}`);
    }
  }

  static async getEventsByDate(date: Date) {
    try {
      const events = await Event.findAll({
        where: {
          date_time: {
            [Op.gte]: date,
            [Op.lt]: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Siguiente día
          },
          is_active: true,
        },
        order: [["date_time", "ASC"]],
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
            [
              Sequelize.fn("HEX", Sequelize.col("organizer_id")),
              "organizer_id",
            ],
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
            ],
          },
        ],
      });
      return events;
    } catch (err: any) {
      console.error("Cannot find events by date:", err);
      throw new Error(`Error fetching events by date: ${err.message}`);
    }
  }

  static async getEventsByDateRange(startDate: Date, endDate: Date) {
    try {
      const events = await Event.findAll({
        where: {
          date_time: {
            [Op.between]: [startDate, endDate],
          },
          is_active: true,
        },
        order: [["date_time", "ASC"]],
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
            [
              Sequelize.fn("HEX", Sequelize.col("organizer_id")),
              "organizer_id",
            ],
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
            [Sequelize.fn("HEX", Sequelize.col("category_id")), "category_id"],
          ],
        },
        include: [
          {
            model: Organization,
            attributes: [
              [
                Sequelize.fn(
                  "HEX",
                  Sequelize.col("Organization.organization_id")
                ),
                "organization_id",
              ],
              "name",
              "logo",
            ],
          },
          {
            model: Category,
            attributes: [
              [
                Sequelize.fn("HEX", Sequelize.col("Category.category_id")),
                "category_id",
              ],
              "name",
            ],
          },
        ],
      });
      return events;
    } catch (err: any) {
      console.error("Cannot find events by date range:", err);
      throw new Error(`Error fetching events by date range: ${err.message}`);
    }
  }

  static async validateUserIsEnrollInEvent(event_id: string, user_id: string) {
    try {
      const event_oid = Buffer.from(event_id, "hex");
      const user_oid = Buffer.from(user_id, "hex");
      const registration = await EventRegistration.findOne({
        where: { event_id: event_oid, volunteer_id: user_oid },
      });
      return registration ? true : false;
    } catch (err: any) {
      console.error("Cannot validate user enrollment in event:", err);
      throw new Error(
        `Error validating user enrollment in event: ${err.message}`
      );
    }
  }

  static async updateVolunteerAttendanceStatus(
    event_id: string,
    user_id: string,
    status: "Asistio" | "Cancelo" | "No Asistio" | "Registrado"
  ) {
    try {
      const event_oid = Buffer.from(event_id, "hex");
      const user_oid = Buffer.from(user_id, "hex");
      const registration = await EventRegistration.findOne({
        where: { event_id: event_oid, volunteer_id: user_oid },
      });
      if (registration) {
        registration.attendance_status = status;
        await registration.save();
        return true;
      } else {
        throw new Error(
          `No se encontró registro de asistencia para el voluntario.`
        );
      }
    } catch (err: any) {
      console.error("Cannot update volunteer attendance status:", err);
      throw new Error(
        `Error updating volunteer attendance status: ${err.message}`
      );
    }
  }

  static async giveCertificate(event_id: string, user_id: string) {
    const t = await sequelize.transaction();
    try {
      const certificate_oid = Buffer.from(ObjectID().toHexString(), "hex");
      const user_oid = Buffer.from(user_id, "hex");
      const oid = Buffer.from(event_id, "hex");
      const event = await Event.findByPk(oid);
      if (!event) {
        await t.rollback();
        throw new Error(`No se encontró el evento con id ${event_id}`);
      }
      const certificate = Certificate.build({
        certificate_id: certificate_oid,
        event_id: event.event_id,
        user_id: user_oid,
        organization_id: event.organization_id,
        issue_date: new Date(),
        is_valid: true,
      });
      const newCertificate = await certificate.save({ transaction: t });
      const eventRegistration = await EventRegistration.findOne({
        where: { event_id: event.event_id, volunteer_id: user_oid },
        transaction: t,
      });
      if (!eventRegistration) {
        await t.rollback();
        throw new Error(
          `No se encontró el registro de asistencia para el voluntario.`
        );
      }
      eventRegistration.is_certificated = true;
      await eventRegistration.save({ transaction: t });
      await t.commit();
      return newCertificate;
    } catch (err: any) {
      console.error("Cannot give certificate to volunteer:", err);
      await t.rollback();
      throw new Error(`Error giving certificate to volunteer: ${err.message}`);
    }
  }

  static async patchEventStatus(
    event_id: string,
    status: "Programado" | "En progreso" | "Cancelado" | "Finalizado"
  ) {
    const t = await sequelize.transaction();
    try {
      const event_oid = Buffer.from(event_id, "hex");
      const event = await Event.findByPk(event_oid);
      if (!event) {
        await t.rollback();
        throw new Error(`No se encontró el evento con id ${event_id}`);
      }
      event.status = status;
      await event.save({ transaction: t });
      await t.commit();
      return true;
    } catch (err: any) {
      console.error("Cannot update event status:", err);
      await t.rollback();
      throw new Error(`Error updating event status: ${err.message}`);
    }
  }
}

export { EventService };
