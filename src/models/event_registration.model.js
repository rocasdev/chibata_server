//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//EventRegistration Model Declaration using sequelize
export const EventRegistration = sequelize.define('EventRegistration', {
    registration_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    event_id: {type: DataTypes.BIGINT, allowNull: false},
    user_id: {type: DataTypes.BIGINT, allowNull: false},
    registration_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    attendance_status: {type: DataTypes.ENUM('pending', 'attended', 'canceled'), allowNull: false}
}, {
    tableName: 'event_registrations',
    timestamps: false
});