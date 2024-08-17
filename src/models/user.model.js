import { DataTypes } from "sequelize"
import {sequelize} from '../config/db.js'

export const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: false},
    last_name: {type: DataTypes.STRING(100), allowNull: false},
    doc: {type: DataTypes.BIGINT(12), allowNull: false, unique: true},
    email: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    pass: {type: DataTypes.STRING(200), allowNull: false},
    role_id: {type: DataTypes.INTEGER, allowNull: false}
},{
    tableName: 'user',
    timestamps: true
})
