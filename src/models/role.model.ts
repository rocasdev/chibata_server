import { sequelize } from "../db/db";
import { Model, DataTypes } from "sequelize";

interface RoleAttributes {
  role_id: number;
  name: string;
  path: string;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  role_id!: number;
  name!: string;
  path!: string;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    underscored: true,
    tableName: "cbt_roles",
    timestamps: false,
  }
);

export { Role };
