//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Award Model Declaration using sequelize
export const Award = sequelize.define('Award', {
    award_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    issued_by: {type: DataTypes.TEXT, allowNull: false},
    issuing_organization_id: {type: DataTypes.BIGINT},
    recipient_id: {type: DataTypes.BIGINT},
    award_file: {type: DataTypes.TEXT},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'awards',
    timestamps: true
});