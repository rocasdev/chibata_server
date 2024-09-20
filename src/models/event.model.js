import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Event extends Model {
    // Método para crear un nuevo evento
    static async createEvent(event) {
        try {
            return await this.create(event);
        } catch (error) {
            console.error(`Unable to create event: ${error}`);
            throw new Error("Cannot create event");
        }
    }

    // Método para obtener todos los eventos
    static async getEvents() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all events: ${error}`);
            throw error;
        }
    }

    // Método para obtener un evento por su ID
    static async getEventById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find event by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un evento
    static async updateEvent(id, updated_event) {
        try {
            const event = await this.findByPk(id);
            return event.update(updated_event);
        } catch (error) {
            console.error(`Unable to update the event: ${error}`);
            throw error;
        }
    }

    // Método para alternar el estado del evento
    static async toggleEventState(id) {
        try {
            const event = await this.findByPk(id);
            const newState = !event.state;
            await event.update({ state: newState });
            return event;
        } catch (error) {
            console.error(`Unable to toggle event state: ${error}`);
            throw error;
        }
    }
}

Event.init({
    event_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'canceled'),
        allowNull: false
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    organizer_id: {
        type: DataTypes.BIGINT,
    },
    organization_id: {
        type: DataTypes.BIGINT,
    }
}, {
    sequelize,
    tableName: 'events',
    timestamps: true,
    underscored: true
});

export { Event };
