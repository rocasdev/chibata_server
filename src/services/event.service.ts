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
        throw new Error(`Event with id ${id} not found`);
      }
      return event;
    } catch (err: any) {
      console.error("Cannot find event by id:", err);
      throw new Error(`Error fetching event by ID: ${err.message}`);
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
}

export { EventService };
