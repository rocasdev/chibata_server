import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { User } from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
					const user = await User.findByPk(id);
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
					const timestamp = Date.now();
					const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
					const uploadPath = path.join(__dirname, '../uploads/img/user_avatar/', uniqueFileName);
					const profilePhotoUrl = `http://localhost:4000/uploads/img/user_avatar/${uniqueFileName}`;

					uploadedFile.mv(uploadPath, async (err) => {
							if (err) {
									return res.status(500).json({ message: 'Error al subir la imagen: ' + err });
							}

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
									relative_photo_url: `./uploads/img/user_avatar/${uniqueFileName}`,
									state: req.body.state
							};

							await User.createUser(u);
							res.status(200).json({ message: 'Usuario creado correctamente' });
					});
			} catch (error) {
					res.status(500).json({ message: 'Error al crear el usuario: ' + error });
			}
	}

	static async putUser(req, res) {
			try {
					const id = req.params.id;
					const u = req.body;
					const user = await User.findByPk(id);

					if (req.files && req.files.profile_photo) {
							const uploadedFile = req.files.profile_photo;
							const timestamp = Date.now();
							const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
							const uploadPath = path.join(__dirname, '../uploads/img/user_avatar/', uniqueFileName);
							const profilePhotoUrl = `http://localhost:4000/uploads/img/user_avatar/${uniqueFileName}`;

							uploadedFile.mv(uploadPath, async (err) => {
									if (err) return res.status(500).json({ message: 'Error al mover el archivo: ' + err });

									if (user.relative_photo_url) {
											const oldImagePath = path.join(__dirname, '..', user.relative_photo_url);
											if (fs.existsSync(oldImagePath)) {
													try {
															fs.unlinkSync(oldImagePath);
															console.log('Imagen anterior eliminada:', oldImagePath);
													} catch (unlinkError) {
															console.error('Error al eliminar la imagen anterior:', unlinkError);
													}
											}
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
											profile_photo: profilePhotoUrl,
											relative_photo_url: `./uploads/img/user_avatar/${uniqueFileName}`
									};

									await User.updateUser(id, updated_user);
									res.status(200).json({ message: 'Usuario actualizado correctamente' });
							});
					} else {
							await User.updateUser(id, u);
							res.status(200).json({ message: 'Usuario actualizado correctamente' });
					}
			} catch (error) {
					res.status(500).json({ message: 'Error al actualizar el usuario: ' + error });
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