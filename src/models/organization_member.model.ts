import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface OrganizationMemberAttributes {
  organization_id: Buffer;
  member_id: Buffer;
  role_in: "Representante" | "Organizador";
}

class OrganizationMember
  extends Model<OrganizationMemberAttributes>
  implements OrganizationMemberAttributes {
    public organization_id!: Buffer;
    public member_id!: Buffer;
    public role_in!: "Representante" | "Organizador";
  }

OrganizationMember.init(
  {
    organization_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_organizations",
        key: "organization_id",
      },
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
      primaryKey: true,
    },
    role_in: {
      type: DataTypes.ENUM,
      values: ["Representante", "Organizador"],
      allowNull: false,
      defaultValue: "Representante",
    },
  },
  {
    sequelize,
    modelName: "OrganizationMember",
    tableName: "cbt_organization_members",
    indexes: [
      {
        name: "PRIMARY",
        using: "BTREE",
        fields: ["organization_id", "member_id"],
      },
    ],
    timestamps: false,
    underscored: true,
  }
);

export { OrganizationMember, OrganizationMemberAttributes };
