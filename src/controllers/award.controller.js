import { Award } from '../models/award.model.js';

class AwardController {
  static async getAwards(req, res) {
    try {
      const awards = await Award.getAwards();
      res.status(200).json(awards);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los premios: ' + error });
    }
  }

  static async getAward(req, res) {
    try {
      const id = req.params.id;
      const award = await Award.getAwardById(id);
      res.status(200).json(award);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el premio: ' + error });
    }
  }

  static async postAward(req, res) {
    try {
      const awardData = req.body;
      await Award.createAward(awardData);
      res.status(200).json({ message: 'Premio creado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el premio: ' + error });
    }
  }

  static async putAward(req, res) {
    try {
      const id = req.params.id;
      const awardData = req.body;
      await Award.updateAward(id, awardData);
      res.status(200).json({ message: 'Premio actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el premio: ' + error });
    }
  }

  static async deleteAward(req, res) {
    try {
      const id = req.params.id;
      await Award.deleteAward(id);
      res.status(200).json({ message: 'Premio eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el premio: ' + error });
    }
  }
}

export default AwardController;
