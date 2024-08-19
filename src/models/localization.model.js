//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Localization Model Declaration using sequelize
export const Localization = sequelize.define('Localization', {
    localization_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.TEXT, allowNull: false},
    latitude: {type: DataTypes.DECIMAL(10, 8)},
    longitude: {type: DataTypes.DECIMAL(11, 8)},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'localizations',
    timestamps: true
});