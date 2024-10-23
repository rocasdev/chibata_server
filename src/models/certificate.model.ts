import ObjectID from "bson-objectid";
import { sequelize } from "../db/db";
import { DataTypes, Model } from "sequelize";

interface CertificateAttributes {
  certificate_id: Buffer;
  file: string;
  relative_file_url: string;
  event_id: Buffer;
}

class Certificate
  extends Model<CertificateAttributes>
  implements CertificateAttributes
{
  public certificate_id!: Buffer;
  public file!: string;
  public relative_file_url!: string;
  public event_id!: Buffer;
  public readonly created_at!: string;
  public readonly updated_at!: string;
}

Certificate.init(
  {
    certificate_id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: () => Buffer.from(ObjectID().toHexString(), "hex"),
    },
    file: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
      },
      allowNull: false,
    },
    relative_file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    modelName: "Certificate",
    underscored: true,
    tableName: "cbt_certificates",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Certificate };
