import { sequelize } from "../db/db";
import { Model, DataTypes } from "sequelize";

interface EventRegistrationAttributes {
  event_id: Buffer;
  volunteer_id: Buffer;
  attendance_status: "Registrado" | "Asistio" | "Cancelo" | "No Asistio";
  is_certificated: boolean;
}

class EventRegistration
  extends Model<EventRegistrationAttributes>
  implements EventRegistrationAttributes
{
  public event_id!: Buffer;
  public volunteer_id!: Buffer;
  public attendance_status!: "Registrado" | "Asistio" | "Cancelo" | "No Asistio";
  public is_certificated!: boolean;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

EventRegistration.init(
  {
    event_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_events",
        key: "event_id",
      },
      primaryKey: true,
    },
    volunteer_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
      primaryKey: true,
    },
    attendance_status: {
      type: DataTypes.ENUM,
      values: ["Registrado", "Asistido", "Cancelado"],
      allowNull: false,
      defaultValue: "Registrado",
    },
    is_certificated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: "EventRegistration",
    underscored: true,
    tableName: "cbt_event_registrations",
    indexes: [
      {
        name: "PRIMARY",
        using: "BTREE",
        fields: ["event_id", "volunteer_id"],
      },
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { EventRegistration };
