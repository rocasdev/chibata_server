//Imports
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

//Comment Model Declaration using sequelize
export const Comment = sequelize.define('Comment', {
    comment_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    event_id: {type: DataTypes.BIGINT, allowNull: false},
    user_id: {type: DataTypes.BIGINT, allowNull: false},
    comment_text: {type: DataTypes.TEXT, allowNull: false},
    rating: {type: DataTypes.INTEGER, validate: {min: 1, max: 5}},
    state: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    tableName: 'comments',
    timestamps: true
});