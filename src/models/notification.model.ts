import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface NotificationAttributes {
  notification_id: Buffer;
  user_id: Buffer;
  title: string;
  message: string;
  is_read: boolean;
}

class Notification
  extends Model<NotificationAttributes>
  implements NotificationAttributes
{
  notification_id!: Buffer;
  user_id!: Buffer;
  title!: string;
  message!: string;
  is_read!: boolean;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

Notification.init(
  {
    notification_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    underscored: true,
    tableName: "cbt_notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Notification, NotificationAttributes };
