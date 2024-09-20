import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Organization extends Model {
    // Método para crear una nueva organización
    static async createOrganization(organization) {
        try {
            return await this.create(organization);
        } catch (error) {
            console.error(`Unable to create organization: ${error}`);
            throw new Error("Cannot create organization");
        }
    }

    // Método para obtener todas las organizaciones
    static async getOrganizations() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all organizations: ${error}`);
            throw error;
        }
    }

    // Método para obtener una organización por su ID
    static async getOrganizationById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find organization by id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar una organización
    static async updateOrganization(id, updated_organization) {
        try {
            const organization = await this.findByPk(id);
            return organization.update(updated_organization);
        } catch (error) {
            console.error(`Unable to update the organization: ${error}`);
            throw error;
        }
    }

    // Método para alternar el estado de la organización
    static async toggleOrganizationState(id) {
        try {
            const organization = await this.findByPk(id);
            const newState = !organization.state;
            await organization.update({ state: newState });
            return organization;
        } catch (error) {
            console.error(`Unable to toggle organization state: ${error}`);
            throw error;
        }
    }
}

Organization.init({
    organization_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    organization_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    registration_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    contact_number: {
        type: DataTypes.BIGINT
    },
    website: {
        type: DataTypes.TEXT
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'organizations',
    timestamps: true,
    underscored: true
});

export { Organization };
