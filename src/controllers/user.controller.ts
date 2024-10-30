import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/uploadimage.util";
import { UploadedFile } from "express-fileupload";
import { UserCreationAttributes } from "../models/user.model";

class UserController {
  async postUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const newUser: UserCreationAttributes = {
        firstname: data.firstname,
        surname: data.surname,
        email: data.email,
        doc_type: data.doc_type,
        doc_num: data.doc_num,
        phone_number: data.phone_number,
        pass: data.pass,
        is_active: data.is_active ?? true,
        role_id: data.role_id,
        avatar: "",
        relative_avatar_url: "",
      };

      if (req.files && req.files.avatar) {
        const avatar_file = req.files.avatar as UploadedFile;

        try {
          const result: any = await uploadImageToCloudinary(
            avatar_file.data,
            "user_avatar"
          );
          newUser.avatar = result.secure_url;
          newUser.relative_avatar_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir la imagen del avatar" });
        }
      }

      await UserService.createUser(newUser);

      res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (err: any) {
      console.error("Controller | Cannot create user: ", err);
      res.status(500).json({
        message: `Error interno al crear el usuario: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot create user: ${err.message}`
      );
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await UserService.findAllUsers(page, limit);
      res.status(200).json({
        message: "Usuarios recuperados exitosamente",
        users: users.users,
        totalPages: users.totalPages,
        currentPage: page,
        totalItems: users.totalItems,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find all users:", err);
      res.status(500).json({
        message: `Error interno al traer los usuarios: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot find all users: ${err.message}`
      );
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const user = await UserService.findUserById(id);
      res
        .status(200)
        .json({ message: "Usuario recuperado exitosamente", user: user });
    } catch (err: any) {
      console.error("Controller | Cannot find user by id:", err);
      res.status(500).json({
        message: `Error interno al traer el usuario: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot find user by id: ${err.message}`
      );
    }
  }

  async getUserOrganization(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const organizations = await UserService.findUserOrganizations(userId);
      console.log(organizations);
      res.status(200).json({
        message: "Organizaciones asociadas recuperadas exitosamente",
        organizations: organizations,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find user organizations:", err);
      res.status(500).json({
        message: `Error interno al traer la organización asociada al usuario: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot find user organizations: ${err.message}`
      );
    }
  }

  async getLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.session.user_id || "";
      const user = await UserService.findUserById(userId);
      res.status(200).json({
        message: "Usuario logeado recuperado exitosamente",
        user: user,
      });
    } catch (err: any) {
      console.error("Controller | Cannot find logged user:", err);
      res.status(500).json({
        message: `Error interno al traer el usuario logueado: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot find logged user: ${err.message}`
      );
    }
  }

  async putUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const data = req.body;

      const existingUser = await UserService.findUserById(userId);
      if (!existingUser) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const updatedUser = {
        firstname: data.firstname || existingUser.firstname,
        surname: data.surname || existingUser.surname,
        avatar: existingUser.avatar,
        relative_avatar_url: existingUser.relative_avatar_url,
      };

      if (req.files && req.files.profile_photo) {
        const avatar_file = req.files.profile_photo as UploadedFile;

        try {
          if (existingUser.relative_avatar_url) {
            await deleteImageFromCloudinary(existingUser.relative_avatar_url);
          }

          const result: any = await uploadImageToCloudinary(
            avatar_file.data,
            "user_avatar"
          );

          updatedUser.avatar = result.secure_url;
          updatedUser.relative_avatar_url = result.public_id;
        } catch (imageUploadError) {
          res
            .status(500)
            .json({ message: "Error al subir la nueva imagen del avatar" });
          return;
        }
      }

      await UserService.updateUser(userId, updatedUser);

      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (err: any) {
      console.error("Controller | Cannot update user: ", err);
      res.status(500).json({
        message: `Error interno al actualizar el usuario: ${err.message}`,
      });
      throw new Error(
        `Controller throws error | Cannot update user: ${err.message}`
      );
    }
  }
}

export default new UserController();
