import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface CommentAttributes {
  comment_id: Buffer;
  content: string;
  rating: number;
  user_id: Buffer;
  event_id: Buffer;
}

interface CommentCreationAttributes extends Omit<CommentAttributes, 'comment_id'> {}

class Comment extends Model<CommentAttributes> implements CommentAttributes {
  public comment_id!: Buffer;
  public content!: string;
  public rating!: number;
  public user_id!: Buffer;
  public event_id!: Buffer;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

Comment.init(
  {
    comment_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
    },
    event_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_events",
        key: "event_id",
      },
    },
  },
  {
    sequelize,
    modelName: "Comment",
    underscored: true,
    tableName: "cbt_comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Comment, CommentAttributes, CommentCreationAttributes };
