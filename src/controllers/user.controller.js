import { User } from '../models/user.model.js';
import cloudinary from 'cloudinary';
import '../models/associations.js';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CDY_CLOUD_NAME,
  api_key: process.env.CDY_API_KEY,
  api_secret: process.env.CDY_API_SECRET,
  secure: true
});

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(buffer);
  readable.push(null);
  return readable;
};

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios: ' + error });
    }
  }

  static async getUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario: ' + error });
    }
  }

  static async getLoggedUser(req, res) {
    try {
      const id = req.logged_user.id;
      console.log(id)
      const u = await User.getUserById(id);
      const user = {
        id: u.user_id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        profile_photo: u.profile_photo,
        role_name: u.Role.role_name,
        role_path: u.Role.role_path
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario: ' + error });
    }
  }

  static async postUser(req, res) {
    try {
      if (!req.files || !req.files.profile_photo) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
      }

      const uploadedFile = req.files.profile_photo;

      // Convertir el buffer del archivo a un stream para Cloudinary
      const fileStream = bufferToStream(uploadedFile.data);

      // Subir la imagen a Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: 'user_avatar' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        fileStream.pipe(uploadStream);
      });

      const u = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        doc_type: req.body.doc_type,
        doc_num: req.body.doc_num,
        phone_number: req.body.phone_number,
        pass: req.body.pass,
        role_id: req.body.role_id,
        profile_photo: result.secure_url,
        relative_photo_url: result.public_id,
        state: req.body.state
      };

      await User.createUser(u);
      res.status(200).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ message: 'Error al crear el usuario: ' + (error.message || error) });
    }
  }

  static async putUser(req, res) {
    try {
      const id = req.params.id;
      const u = req.body;
      const user = await User.findByPk(id);

      if (req.files && req.files.profile_photo) {
        const uploadedFile = req.files.profile_photo;

        // Convertir el buffer del archivo a un stream para Cloudinary
        const fileStream = bufferToStream(uploadedFile.data);

        // Subir la nueva imagen a Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: 'user_avatar' },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );

          fileStream.pipe(uploadStream);
        });

        // Eliminar la imagen anterior en Cloudinary si existe
        if (user.relative_photo_url) {
          await cloudinary.v2.uploader.destroy(user.relative_photo_url);
        }

        const updated_user = {
          name: u.name,
          surname: u.surname,
          doc_type: u.doc_type,
          doc_num: u.doc_num,
          email: u.email,
          phone_number: u.phone_number,
          pass: u.pass,
          role_id: u.role_id,
          profile_photo: result.secure_url, // Nueva URL de la imagen en Cloudinary
          relative_photo_url: result.public_id // Nuevo ID público de la imagen en Cloudinary
        };

        await User.updateUser(id, updated_user);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
      } else {
        await User.updateUser(id, u);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ message: 'Error al actualizar el usuario: ' + (error.message || error) });
    }
  }

  static async patchUser(req, res) {
    try {
      const id = req.params.id;
      await User.toggleUserState(id);
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del usuario: ' + error });
    }
  }
}

export default UserController;
