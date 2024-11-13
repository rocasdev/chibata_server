import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { Model, DataTypes } from "sequelize";

interface EventAttributes {
  event_id: Buffer;
  title: string;
  description: string;
  slug: string;
  date_time: Date;
  address: string;
  latitude: number;
  longitude: number;
  banner: string;
  relative_banner_url: string;
  organizer_id: Buffer;
  organization_id: Buffer;
  category_id: Buffer;
  status: "Programado" | "En progreso" | "Cancelado" | "Finalizado";
  is_active: boolean;
  max_volunteers: number;
  current_volunteers: number;
}

interface EventCreationAttributes extends Omit<EventAttributes, "event_id"> {}

class Event extends Model<EventAttributes> implements EventAttributes {
  public event_id!: Buffer;
  public title!: string;
  public description!: string;
  public slug!: string;
  public date_time!: Date;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public banner!: string;
  public relative_banner_url!: string;
  public organizer_id!: Buffer;
  public organization_id!: Buffer;
  public category_id!: Buffer;
  public status!: "Programado" | "En progreso" | "Cancelado" | "Finalizado";
  public is_active!: boolean;
  public max_volunteers!: number;
  public current_volunteers!: number;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

Event.init(
  {
    event_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    banner: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relative_banner_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_categories",
        key: "category_id",
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Programado", "En Progreso", "Finalizado", "Cancelado"],
      allowNull: false,
      defaultValue: "Programado",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    organizer_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
    },
    organization_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_organizations",
        key: "organization_id",
      },
    },
    max_volunteers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_volunteers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    modelName: "Event",
    underscored: true,
    tableName: "cbt_events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Event, EventAttributes, EventCreationAttributes };
