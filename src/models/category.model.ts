import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface CategoryAttributes {
  category_id: Buffer;
  name: string;
  description: string;
  is_active: boolean;
}

interface CategoryCreationAttributes extends Omit<CategoryAttributes, "category_id"> {}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  category_id!: Buffer;
  name!: string;
  description!: string;
  is_active!: boolean;
}

Category.init(
  {
    category_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Category",
    underscored: true,
    tableName: "cbt_categories",
    timestamps: false,
  }
);

export { Category, CategoryAttributes, CategoryCreationAttributes };
