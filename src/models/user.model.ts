import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { Model, DataTypes } from "sequelize";
import { Role } from "./role.model";
import { OrganizationMember } from "./organization_member.model";
import { Organization } from "./organization.model";

interface UserAttributes {
  user_id: Buffer;
  firstname: string;
  surname: string;
  email: string;
  doc_type: "CC" | "CE" | "PA";
  doc_num: number;
  phone_number: number;
  pass: string;
  avatar?: string;
  relative_avatar_url?: string;
  is_active: boolean;
  role_id: number;
}

interface UserCreationAttributes extends Omit<UserAttributes, "user_id"> {}

interface UserWithOrganizations extends UserAttributes {
  OrganizationMember?: OrganizationMember[] | null & {
    organizations?: Organization[] | null
  };
}

class User extends Model<UserAttributes> implements UserAttributes {
  public user_id!: Buffer;
  public firstname!: string;
  public surname!: string;
  public email!: string;
  public doc_type!: "CC" | "CE" | "PA";
  public doc_num!: number;
  public phone_number!: number;
  public pass!: string;
  public avatar?: string;
  public relative_avatar_url?: string;
  public is_active!: boolean;
  public role_id!: number;
  public readonly Role!: Role;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

User.init(
  {
    user_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    doc_type: {
      type: DataTypes.ENUM,
      values: ["CC", "CE", "PA"],
      allowNull: false,
    },
    doc_num: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
    relative_avatar_url: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cbt_roles",
        key: "role_id",
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    underscored: true,
    tableName: "cbt_users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { User, UserAttributes, UserCreationAttributes, UserWithOrganizations };
