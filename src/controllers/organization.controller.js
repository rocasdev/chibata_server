import { Organization } from '../models/organization.model.js';

class OrganizationController {
  static async getOrganizations(req, res) {
    try {
      const organizations = await Organization.getOrganizations();
      res.status(200).json(organizations);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las organizaciones: ' + error });
    }
  }

  static async getOrganization(req, res) {
    try {
      const id = req.params.id;
      const organization = await Organization.getOrganizationById(id);
      res.status(200).json(organization);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la organización: ' + error });
    }
  }

  static async postOrganization(req, res) {
    try {
      const orgData = req.body;
      await Organization.createOrganization(orgData);
      res.status(200).json({ message: 'Organización creada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la organización: ' + error });
    }
  }

  static async putOrganization(req, res) {
    try {
      const id = req.params.id;
      const orgData = req.body;
      await Organization.updateOrganization(id, orgData);
      res.status(200).json({ message: 'Organización actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la organización: ' + error });
    }
  }

  static async deleteOrganization(req, res) {
    try {
      const id = req.params.id;
      await Organization.deleteOrganization(id);
      res.status(200).json({ message: 'Organización eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la organización: ' + error });
    }
  }
}

export default OrganizationController;
