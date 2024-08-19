//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Organization Model Declaration using sequelize
export const Organization = sequelize.define('Organization', {
    organization_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    organization_name: {type: DataTypes.TEXT, allowNull: false},
    nit: {type: DataTypes.STRING(20), allowNull: false, unique: true},
    address: {type: DataTypes.TEXT, allowNull: false},
    legal_representative: {type: DataTypes.TEXT, allowNull: false},
    registration_date: {type: DataTypes.DATE, allowNull: false},
    contact_number: {type: DataTypes.BIGINT},
    website: {type: DataTypes.TEXT},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'organizations',
    timestamps: true
});