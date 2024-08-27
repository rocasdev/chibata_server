import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Role } from './role.model.js';
import bcrypt from 'bcrypt'

// Definición de la clase User que extiende de Model
class User extends Model {
	// Método para crear un nuevo usuario
	static async createUser(user) {
		try {
			const hashedPassword = await bcrypt.hash(user.pass, 2)
			user.pass = hashedPassword
			return await this.create(user);
		} catch (error) {
			console.error(`Unable to create user: ${error}`);
			throw new Error("Cannot create user");
		}
	}

	// Método para obtener todos los usuarios
	static async getUsers() {
		try {
			return await this.findAll({
				include: [{
					model: Role,
					attributes: ['role_name'],
				}],
			});
		} catch (error) {
			console.error(`Unable to find all users: ${error}`);
			throw error;
		}
	}

	// Método para obtener un usuario por su ID
	static async getUserById(id) {
		try {
			return await this.findByPk({
				where: { user_id: id },
				include: [{
					model: Role,
					attributes: ['role_name'],
				}],
			});
		} catch (error) {
			console.error(`Unable to find user by id: ${error}`);
			throw error;
		}
	}

	// Método para actualizar un usuario
	static async updateUser(id, updated_user) {
		try {
			const user = await this.findByPk(id);
			return user.update(updated_user);
		} catch (error) {
			console.error(`Unable to update the user: ${error}`);
			throw error;
		}
	}

	// Método para alternar el estado del usuario
	static async toggleUserState(id) {
		try {
			const user = await this.findByPk(id);
			const newState = !user.state;
			await user.update({ state: newState });
			return user;
		} catch (error) {
			console.error(`Unable to toggle user state: ${error}`);
			throw error;
		}
	}

	async comparePassword(pass) {
        return await bcrypt.compare(pass, this.pass);
    }
}

// Definición del modelo User en Sequelize
User.init({
	user_id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	surname: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	email: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true
	},
	doc_type: {
		type: DataTypes.ENUM("CC", "CE", "PA"),
		allowNull: false
	},
	doc_num: {
		type: DataTypes.BIGINT,
		allowNull: false,
		unique: true
	},
	phone_number: {
		type: DataTypes.BIGINT,
		allowNull: false,
		unique: true
	},
	pass: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	role_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	profile_photo: {
		type: DataTypes.TEXT
	},
	relative_photo_url: {
		type: DataTypes.TEXT
	},
	state: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
}, {
	sequelize,
	tableName: 'users',
	underscored: true,
	timestamps: true,
	
});

export { User };