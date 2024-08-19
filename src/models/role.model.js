//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Roles Model Declaration using sequelize
export const Role = sequelize.define('Role', {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: { type: DataTypes.STRING(12), allowNull: false }
}, {
    tableName: 'roles',
    timestamps: false
});