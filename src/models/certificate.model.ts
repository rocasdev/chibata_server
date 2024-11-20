import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface CertificateAttributes {
  certificate_id: Buffer;
  user_id: Buffer;
  event_id: Buffer;
  organization_id: Buffer;
  issue_date: Date;
  is_valid: boolean;
}

class Certificate
  extends Model<CertificateAttributes>
  implements CertificateAttributes
{
  public certificate_id!: Buffer;
  public user_id!: Buffer;
  public organization_id!: Buffer;
  public event_id!: Buffer;
  public issue_date!: Date;
  public is_valid!: boolean;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

Certificate.init(
  {
    certificate_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
    },
    user_id: {
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
    event_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: "cbt_events",
        key: "event_id",
      },
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Certificate",
    underscored: true,
    tableName: "cbt_certificates",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Certificate };
