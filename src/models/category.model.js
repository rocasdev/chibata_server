//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Category Model Declaration using sequelize
export const Category = sequelize.define('Category', {
    category_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    category_name: {type: DataTypes.TEXT, allowNull: false, unique: true},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'categories',
    timestamps: false
});