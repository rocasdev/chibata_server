//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Notification Model Declaration using sequelize
export const Notification = sequelize.define('Notification', {
    notification_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.BIGINT},
    event_id: {type: DataTypes.BIGINT},
    notification_type: {type: DataTypes.TEXT, allowNull: false},
    message: {type: DataTypes.TEXT, allowNull: false},
    is_read: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'notifications',
    timestamps: true
});