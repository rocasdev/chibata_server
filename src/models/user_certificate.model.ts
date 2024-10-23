import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface UserCertificateAttributes {
  certificate_id: Buffer;
  user_id: Buffer;
  is_active: boolean;
}

class UserCertificate
  extends Model<UserCertificateAttributes>
  implements UserCertificateAttributes {
    public certificate_id!: Buffer;
    public user_id!: Buffer;
    public is_active!: boolean;
  }

UserCertificate.init(
  {
    certificate_id: {
      type: DataTypes.BLOB(),
      allowNull: false,
      references: {
        model: "cbt_certificates",
        key: "certificate_id",
      },
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_users",
        key: "user_id",
      },
      primaryKey: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "UserCertificate",
    underscored: true,
    tableName: "cbt_user_certificates",
    indexes: [
      {
        name: "PRIMARY",
        using: "BTREE",
        fields: ["certificate_id", "user_id"],
      },
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { UserCertificate, UserCertificateAttributes };
