import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { User } from '../models/user.model.js'

export const getUsers = async (req, res) => {
    try {
        const users = await User.getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' + error })
    }
}

export const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' + error })
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const postUser = async (req, res) => {
    try {
        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        const uploadedFile = req.files.avatar;
        const timestamp = Date.now();
        const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;

        const uploadPath = path.join(__dirname, '../uploads/users_avatar/', uniqueFileName);

        uploadedFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al subir la imagen' });
            }

            const profilePhotoUrl = `http://localhost:4000/uploads/users_avatar/${uniqueFileName}`;

            const u = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                doc_type: req.body.doc_type,
                doc_num: req.body.doc_num,
                phone_number: req.body.phone_number,
                pass: req.body.pass,
                role_id: req.body.role_id,
                profile_photo: profilePhotoUrl,
                state: req.body.state
            };

            await User.create(u);
            res.status(200).json({
                message: 'Usuario creado correctamente' // Incluye la URL completa
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario: ' + error });
    }
};

export const putUser = async (req, res) => {
    try {
        const id = req.params.id;
        const u = req.body;

        // Primero obtenemos al usuario actual para conocer la imagen guardada
        const user = await User.findByPk(id);

        // Verificamos si se sube una nueva imagen
        if (req.files && req.files.avatar) {
            const uploadedFile = req.files.avatar;
            const timestamp = Date.now();
            const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../../uploads/users_avatar/', uniqueFileName);

            // Movemos la nueva imagen al servidor
            uploadedFile.mv(uploadPath, async (err) => {
                if (err) return res.status(500).json({ message: 'Error al mover el archivo', error: err });

                // Eliminamos la imagen anterior si existe
                if (user.profile_photo) {
                    const oldImagePath = path.join(__dirname, '../../', user.profile_photo);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                // Actualizamos el usuario con la nueva imagen
                await User.update({
                    name: u.name,
                    surname: u.surname,
                    doc_type: u.doc_type,
                    doc_num: u.doc_num,
                    email: u.email,
                    phone_number: u.phone_number,
                    pass: u.pass,
                    role_id: u.role_id,
                    profile_photo: `/uploads/users_avatar/${uniqueFileName}`
                }, {
                    where: { user_id: id }
                });

                res.status(200).json({ message: 'Usuario actualizado correctamente' });
            });
        } else {
            // Si no hay una nueva imagen, actualizamos solo los demás campos
            await User.update({
                name: u.name,
                surname: u.surname,
                doc_type: u.doc_type,
                doc_num: u.doc_num,
                email: u.email,
                phone_number: u.phone_number,
                pass: u.pass,
                role_id: u.role_id
            }, {
                where: { user_id: id }
            });

            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

export const patchUser = async (req, res) => {
    try {
        const id = req.params.id
        await User.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' + error })

    }
}