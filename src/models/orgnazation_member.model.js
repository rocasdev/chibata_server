import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class OrganizationMember extends Model {
    // Método para crear un nuevo miembro en una organización
    static async createMember(member) {
        try {
            return await this.create(member);
        } catch (error) {
            console.error(`Unable to create organization member: ${error}`);
            throw new Error("Cannot create organization member");
        }
    }

    // Método para obtener todos los miembros de organizaciones
    static async getMembers() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all organization members: ${error}`);
            throw error;
        }
    }

    // Método para obtener un miembro de una organización por su ID
    static async getMemberById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find organization member by id: ${error}`);
            throw error;
        }
    }

    // Método para obtener miembros de una organización por su ID de organización
    static async getMembersByOrganizationId(organization_id) {
        try {
            return await this.findAll({
                where: { organization_id }
            });
        } catch (error) {
            console.error(`Unable to find members by organization id: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un miembro de una organización
    static async updateMember(id, updated_member) {
        try {
            const member = await this.findByPk(id);
            return member.update(updated_member);
        } catch (error) {
            console.error(`Unable to update the organization member: ${error}`);
            throw error;
        }
    }

    // Método para eliminar un miembro de una organización
    static async deleteMember(id) {
        try {
            const member = await this.findByPk(id);
            return member.destroy();
        } catch (error) {
            console.error(`Unable to delete organization member: ${error}`);
            throw error;
        }
    }
}

OrganizationMember.init({
    member_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    organization_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'organization_members',
    timestamps: false
});

export { OrganizationMember };
