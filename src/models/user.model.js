//Imports
import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"
import { Role } from "./role.model.js"

//User Model Declaration using sequelize
export const User = sequelize.define("User",
  {
    user_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    surname: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    doc_type: { type: DataTypes.ENUM("CC", "CE", "PA"), allowNull: false },
    doc_num: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    phone_number: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    pass: { type: DataTypes.TEXT, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    profile_photo: { type: DataTypes.TEXT },
    state: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "users",
    timestamps: true,
  }
)

//User model methods
User.createUser = async function (user) {
  try {
    return await this.create(user);
  } catch (error) {
    return console.error(`Unable to create user: ${error}`);
  }
}

User.getUsers = async function () {
  try {
    return await this.findAll({
      include: [{
        model: Role,
        attributes: ['role_id', 'role_name']
      }]
    });
  } catch (error) {
    console.error(`Unable to find all users: ${error}`);
    throw error;
  }
}

User.getUserById = async function (id) {
  try {
    return await this.findByPk(id);
  } catch (error) {
    return console.error(`Unable to find user by id: ${error}`);
  }
}

User.updateUser = async function (id, updated_user) {
  try {
    const user = await this.findByPk(id);
    user.update(updated_user);
  } catch (error) {
    console.error(`Unable to update the user: ${error}`);
  }
}

User.toggleUserState = async function (id) {
  try {
    const user = await this.findByPk(id);
    user.query("CALL sp_toggleUserState");
  } catch (error) {
    console.error(`Unable to patch user: ${error}`)
  }
}