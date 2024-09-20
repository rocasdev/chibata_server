import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class EventRegistration extends Model {
    // Método para crear una nueva inscripción a un evento
    static async createRegistration(registration) {
        try {
            return await this.create(registration);
        } catch (error) {
            console.error(`Unable to create registration: ${error}`);
            throw new Error("Cannot create registration");
        }
    }

    // Método para obtener todas las inscripciones a eventos
    static async getRegistrations() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all registrations: ${error}`);
            throw error;
        }
    }

    // Método para obtener una inscripción por su ID
    static async getRegistrationById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find registration by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar una inscripción
    static async updateRegistration(id, updated_registration) {
        try {
            const registration = await this.findByPk(id);
            return registration.update(updated_registration);
        } catch (error) {
            console.error(`Unable to update the registration: ${error}`);
            throw error;
        }
    }

    // Método para alternar el estado de asistencia de una inscripción
    static async toggleAttendanceStatus(id, status) {
        try {
            const registration = await this.findByPk(id);
            await registration.update({ attendance_status: status });
            return registration;
        } catch (error) {
            console.error(`Unable to toggle attendance status: ${error}`);
            throw error;
        }
    }
}

EventRegistration.init({
    registration_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    event_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    attendance_status: {
        type: DataTypes.ENUM('pending', 'attended', 'canceled'),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'event_registrations',
    timestamps: false
});

export { EventRegistration };
