import {
  Organization,
  OrganizationAttributes,
  OrganizationCreationAttributes,
} from "../models/organization.model";
import { OrganizationMember } from "../models/organization_member.model";
import { sequelize } from "../db/db";
import ObjectID from "bson-objectid";
import { Sequelize } from "sequelize";

class OrganizationService {
  constructor() {
    console.log("OrganizationService instance created");
  }

  static async createOrganization(orgData: OrganizationCreationAttributes) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      const organization = Organization.build({
        ...orgData,
        organization_id: oid,
      });
      const newOrganization = await organization.save({ transaction: t });
      await t.commit();
      return newOrganization;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create organization:", err);
      throw new Error(`Error creating organization: ${err.message}`);
    }
  }

  static async findAllOrganizations(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: organizations } = await Organization.findAndCountAll(
        {
          attributes: {
            include: [
              [
                Sequelize.fn("HEX", Sequelize.col("organization_id")),
                "organization_id",
              ],
            ],
          },
          order: [["created_at", "DESC"]],
          limit,
          offset,
        }
      );

      const totalPages = Math.ceil(count / limit);

      return {
        organizations,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (err: any) {
      console.error("Cannot find all organizations:", err);
      throw new Error(`Error fetching all organizations: ${err.message}`);
    }
  }

  static async findOrganizationById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const organization = await Organization.findByPk(oid, {
        attributes: {
          include: [
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
          ],
        },
      });
      if (!organization) {
        throw new Error(`Organization with id ${id} not found`);
      }
      return organization;
    } catch (err: any) {
      console.error("Cannot find organization by id:", err);
      throw new Error(`Error fetching organization by ID: ${err.message}`);
    }
  }

  static async updateOrganization(
    id: string,
    org: Partial<OrganizationAttributes>
  ) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const organization = await Organization.findByPk(oid, { transaction: t });
      if (!organization) {
        throw new Error(`Organization with id ${id} not found`);
      }
      await organization.update(org, { transaction: t });
      await t.commit();
      return organization;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update organization:", err);
      throw new Error(`Error updating organization: ${err.message}`);
    }
  }

  static async toggleOrganizationState(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const organization = await Organization.findByPk(oid, { transaction: t });
      if (!organization) {
        throw new Error(`Organization with id ${id} not found`);
      }
      organization.is_active = !organization.is_active;
      await organization.save({ transaction: t });
      await t.commit();
      return organization;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot toggle organization state:", err);
      throw new Error(`Error toggling organization state: ${err.message}`);
    }
  }

  static async findOrganizationByNit(nit: string) {
    try {
      const organization = await Organization.findOne({
        where: { nit },
        attributes: {
          include: [
            [
              Sequelize.fn("HEX", Sequelize.col("organization_id")),
              "organization_id",
            ],
          ],
        },
      });
      if (!organization) {
        throw new Error(`Organization with NIT ${nit} not found`);
      }
      return organization;
    } catch (err: any) {
      console.error("Cannot find organization by NIT:", err);
      throw new Error(`Error fetching organization by NIT: ${err.message}`);
    }
  }

  static async deleteOrganization(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const organization = await Organization.findByPk(oid, { transaction: t });
      if (!organization) {
        throw new Error(`Organization with id ${id} not found`);
      }
      await organization.destroy({ transaction: t });
      await t.commit();
      return true;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot delete organization:", err);
      throw new Error(`Error deleting organization: ${err.message}`);
    }
  }

  static async addMember(
    organizationId: string,
    memberId: string,
    roleIn: "Representante" | "Organizador"
  ) {
    const t = await sequelize.transaction();
    try {
      const orgId = Buffer.from(organizationId, "hex");
      const memId = Buffer.from(memberId, "hex");

      const [organizationMember, created] =
        await OrganizationMember.findOrCreate({
          where: { organization_id: orgId, member_id: memId },
          defaults: {
            organization_id: orgId,
            member_id: memId,
            role_in: roleIn || "Representante",
          },
          transaction: t,
        });

      if (!created) {
        // If the member already exists, update their role
        await organizationMember.update(
          { role_in: roleIn },
          { transaction: t }
        );
      }

      await t.commit();
      return organizationMember;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot add member to organization:", err);
      throw new Error(`Error adding member to organization: ${err.message}`);
    }
  }

  static async removeMember(organizationId: string, memberId: string) {
    const t = await sequelize.transaction();
    try {
      const orgId = Buffer.from(organizationId, "hex");
      const memId = Buffer.from(memberId, "hex");

      const result = await OrganizationMember.destroy({
        where: { organization_id: orgId, member_id: memId },
        transaction: t,
      });

      if (result === 0) {
        throw new Error(
          `Member with id ${memberId} not found in organization ${organizationId}`
        );
      }

      await t.commit();
      return true;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot remove member from organization:", err);
      throw new Error(
        `Error removing member from organization: ${err.message}`
      );
    }
  }

  static async countOrganizations() {
    try {
      const count = await Organization.count();
      return count;
    } catch (err: any) {
      console.error("Cannot count organizations:", err);
      throw new Error(`Error counting organizations: ${err.message}`);
    }
  }

  static async getMembers(organizationId: string) {
    const orgId = Buffer.from(organizationId, "hex");
    try {
      const members = await OrganizationMember.findAll({
        where: { organization_id: orgId },
        attributes: ["member_id", "role_in"],
      });
      return members;
    } catch (err: any) {
      console.error("Cannot get members of organization:", err);
      throw new Error(`Error getting members of organization: ${err.message}`);
    }
  }
}

export { OrganizationService };
