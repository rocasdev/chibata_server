import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import { UploadedFile } from "express-fileupload";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/upload_image.util";
import { OrganizationAttributes, OrganizationCreationAttributes } from "../models/organization.model";

class OrganizationController {
  async postOrganization(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const newOrganization: OrganizationCreationAttributes = {
        name: data.name,
        nit: data.nit,
        address: data.address,
        founding_date: data.founding_date,
        contact_number: data.contact_number,
        website: data.website,
        is_active: data.is_active ?? true,
        logo: "",
        relative_logo_url: "",
      };

      if (req.files && req.files.logo) {
        const logo_file = req.files.logo as UploadedFile;

        try {
          const result: any = await uploadImageToCloudinary(
            logo_file.data,
            "organization_logo"
          );
          newOrganization.logo = result.secure_url;
          newOrganization.relative_logo_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir el logo de la organización" });
          return;
        }
      }

      const createdOrganization = await OrganizationService.createOrganization(
        newOrganization
      );

      res.status(201).json({
        message: "Organización creada correctamente",
        organization: createdOrganization,
      });
    } catch (err: any) {
      console.error("Controller | Cannot create organization: ", err);
      res.status(500).json({
        message: `Error interno al crear la organización: ${err.message}`,
      });
    }
  }

  async getOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const organizations = await OrganizationService.findAllOrganizations(page, limit);
      res.status(200).json({
        message: "Organizaciones recuperadas exitosamente",
        organizations: organizations.organizations,
        totalPages: organizations.totalPages,
        currentPage: organizations.currentPage,
        totalItems: organizations.totalItems,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all organizations:", err);
      res.status(500).json({
        message: `Error interno al traer las organizaciones: ${err.message}`,
      });
    }
  }

  async getOrganization(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const organization = await OrganizationService.findOrganizationById(id);
      if (!organization) {
        res.status(404).json({ message: "Organización no encontrada" });
        return;
      }
      res.status(200).json({
        message: "Organización recuperada exitosamente",
        organization: organization,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find organization by id:", err);
      res.status(500).json({
        message: `Error interno al traer la organización: ${err.message}`,
      });
    }
  }

  async putOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      const data = req.body;

      const existingOrganization =
        await OrganizationService.findOrganizationById(organizationId);
      if (!existingOrganization) {
        res.status(404).json({ message: "Organización no encontrada" });
        return;
      }

      const updatedOrganization: Partial<OrganizationAttributes> = {
        name: data.name || existingOrganization.name,
        nit: data.nit || existingOrganization.nit,
        address: data.address || existingOrganization.address,
        founding_date: data.founding_date
          ? data.founding_date
          : existingOrganization.founding_date,
        contact_number:
          data.contact_number || existingOrganization.contact_number,
        website: data.website || existingOrganization.website,
        is_active:
          data.is_active !== undefined
            ? data.is_active
            : existingOrganization.is_active,
        logo: existingOrganization.logo,
        relative_logo_url: existingOrganization.relative_logo_url,
      };

      if (req.files && req.files.logo) {
        const logo_file = req.files.logo as UploadedFile;

        try {
          if (existingOrganization.relative_logo_url) {
            await deleteImageFromCloudinary(
              existingOrganization.relative_logo_url
            );
          }

          const result: any = await uploadImageToCloudinary(
            logo_file.data,
            "organization_logo"
          );

          updatedOrganization.logo = result.secure_url;
          updatedOrganization.relative_logo_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({
              message: "Error al subir el nuevo logo de la organización",
            });
          return;
        }
      }

      await OrganizationService.updateOrganization(
        organizationId,
        updatedOrganization
      );

      res
        .status(200)
        .json({ message: "Organización actualizada correctamente" });
    } catch (err: any) {
      console.error("Controller | Cannot update organization: ", err);
      res.status(500).json({
        message: `Error interno al actualizar la organización: ${err.message}`,
      });
    }
  }

  async deleteOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      await OrganizationService.deleteOrganization(organizationId);
      res.status(200).json({ message: "Organización eliminada correctamente" });
    } catch (err: any) {
      console.error("Controller | Cannot delete organization: ", err);
      res.status(500).json({
        message: `Error interno al eliminar la organización: ${err.message}`,
      });
    }
  }

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      const { userId, role } = req.body;

      await OrganizationService.addMember(organizationId, userId, role);
      res
        .status(200)
        .json({ message: "Miembro añadido correctamente a la organización" });
    } catch (err: any) {
      console.error("Controller | Cannot add member to organization: ", err);
      res.status(500).json({
        message: `Error interno al añadir miembro a la organización: ${err.message}`,
      });
    }
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      const { userId } = req.body;

      await OrganizationService.removeMember(organizationId, userId);
      res
        .status(200)
        .json({
          message: "Miembro eliminado correctamente de la organización",
        });
    } catch (err: any) {
      console.error(
        "Controller | Cannot remove member from organization: ",
        err
      );
      res.status(500).json({
        message: `Error interno al eliminar miembro de la organización: ${err.message}`,
      });
    }
  }

  async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      const members = await OrganizationService.getMembers(organizationId);
      res.status(200).json({
        message: "Miembros de la organización recuperados exitosamente",
        members: members,
      });
    } catch (err: any) {
      console.error("Controller | Cannot get members from organization: ", err);
      res.status(500).json({
        message: `Error interno al traer los miembros de la organización: ${err.message}`,
      });
    }
  }
}

export default new OrganizationController();
