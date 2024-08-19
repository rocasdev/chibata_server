//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Event Model Declaration using sequelize
export const Event = sequelize.define('Event', {
    event_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.TEXT, allowNull: false},
    description: {type: DataTypes.TEXT},
    date: {type: DataTypes.DATE, allowNull: false},
    time: {type: DataTypes.TIME, allowNull: false},
    status: {type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'canceled'), allowNull: false},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'events',
    timestamps: true
});