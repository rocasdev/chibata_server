//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//EventCategory Model Declaration using sequelize
export const EventCategory = sequelize.define('EventCategory', {
    event_id: {type: DataTypes.BIGINT, primaryKey: true},
    category_id: {type: DataTypes.BIGINT, primaryKey: true}
}, {
    tableName: 'event_categories',
    timestamps: false
});