//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//OrganizationMember Model Declaration using sequelize
export const OrganizationMember = sequelize.define('OrganizationMember', {
    member_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    organization_id: {type: DataTypes.BIGINT, allowNull: false},
    user_id: {type: DataTypes.BIGINT, allowNull: false},
    role_in: {type: DataTypes.ENUM('organizer', 'admin'), allowNull: false}
}, {
    tableName: 'organization_members',
    timestamps: false
});