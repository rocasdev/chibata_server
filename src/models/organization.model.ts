import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { Model, DataTypes } from "sequelize";

interface OrganizationAttributes {
  organization_id: Buffer;
  name: string;
  nit: string;
  logo?: string;
  relative_logo_url?: string;
  address: string;
  founding_date: string;
  contact_number: number;
  is_active: boolean;
  website?: string;
}

interface OrganizationCreationAttributes
  extends Omit<OrganizationAttributes, "organization_id"> {}

class Organization
  extends Model<OrganizationAttributes>
  implements OrganizationAttributes
{
  public organization_id!: Buffer;
  public name!: string;
  public nit!: string;
  public logo?: string;
  public relative_logo_url?: string;
  public address!: string;
  public founding_date!: string;
  public contact_number!: number;
  public is_active!: boolean;
  public website?: string;
}

Organization.init(
  {
    organization_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.TEXT,
    },
    relative_logo_url: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    founding_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    contact_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    website: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Organization",
    underscored: true,
    tableName: "cbt_organizations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Organization, OrganizationAttributes, OrganizationCreationAttributes };
