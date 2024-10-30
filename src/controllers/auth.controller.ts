import { UserService } from "../services/user.service";
import { OrganizationService } from "../services/organization.service";
import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../utils/uploadimage.util";
import { UploadedFile } from "express-fileupload";
import { UserCreationAttributes } from "../models/user.model";
import { OrganizationCreationAttributes } from "../models/organization.model";
import path from "path";
import fs from "fs/promises";
import { sendEmail } from "../utils/mailsender.util";

declare module "express-session" {
  interface SessionData {
    user_id: string;
    role_id: number;
    is_active: boolean;
  }
}

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await UserService.authenticate(email, password);

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ message: "Usuario inactivo" });
      return;
    }

    const logged_user = {
      user_id: user.user_id.toString("hex").toLowerCase(),
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      avatar: user.avatar,
      is_active: user.is_active,
      role_id: user.role_id,
      role_path: user.Role.path,
      role_name: user.Role.name,
    };

    req.session.user_id = logged_user.user_id;
    req.session.role_id = logged_user.role_id;

    res.status(200).json({
      message: "Sesión iniciada correctamente",
      user: logged_user,
    });
  }

  async registerOrganization(req: Request, res: Response): Promise<void> {
    try {
      const orgData = {
        name: req.body.org_name,
        nit: req.body.nit,
        address: req.body.address,
        founding_date: req.body.registration_date,
        contact_number: req.body.contact_number,
        website: req.body.website,
      };

      const userData = {
        firstname: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        pass: req.body.pass,
        doc_type: req.body.doc_type,
        doc_num: req.body.doc_num,
        phone_number: req.body.phone_number,
      };

      const newOrganization: OrganizationCreationAttributes = {
        name: orgData.name,
        nit: orgData.nit,
        address: orgData.address,
        founding_date: orgData.founding_date,
        contact_number: orgData.contact_number,
        website: orgData.website,
        is_active: true,
        logo: "",
        relative_logo_url: "",
      };

      if (req.files && req.files.org_logo) {
        const logo_file = req.files.org_logo as UploadedFile;
        const result: any = await uploadImageToCloudinary(
          logo_file.data,
          "organization_logo"
        );
        newOrganization.logo = result.secure_url;
        newOrganization.relative_logo_url = result.public_id;
      }

      const createdOrganization = await OrganizationService.createOrganization(
        newOrganization
      );

      const newUser: UserCreationAttributes = {
        firstname: userData.firstname,
        surname: userData.surname,
        email: userData.email,
        pass: userData.pass,
        doc_type: userData.doc_type,
        doc_num: userData.doc_num,
        phone_number: userData.phone_number,
        is_active: true,
        role_id: 2,
        avatar: "",
        relative_avatar_url: "",
      };

      if (req.files && req.files.profile_photo) {
        const avatar_file = req.files.profile_photo as UploadedFile;
        const result: any = await uploadImageToCloudinary(
          avatar_file.data,
          "user_avatar"
        );
        newUser.avatar = result.secure_url;
        newUser.relative_avatar_url = result.public_id;
      }

      const createdUser = await UserService.createUser(newUser);

      await OrganizationService.addMember(
        createdOrganization.organization_id.toString("hex"),
        createdUser.user_id.toString("hex"),
        "Representante"
      );

      res.status(201).json({
        message:
          "Organización y usuario representante registrados correctamente",
        organization: createdOrganization,
        user: {
          user_id: createdUser.user_id.toString("hex"),
          firstname: createdUser.firstname,
          surname: createdUser.surname,
          email: createdUser.email,
          avatar: createdUser.avatar,
        },
      });
    } catch (err: any) {
      console.error("Controller | Cannot register organization: ", err);
      res.status(500).json({
        message: `Error interno al registrar la organización: ${err.message}`,
      });
    }
  }

  async registerVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      const newUser: UserCreationAttributes = {
        firstname: userData.name,
        surname: userData.surname,
        email: userData.email,
        pass: userData.pass,
        doc_type: userData.doc_type,
        doc_num: userData.doc_num,
        phone_number: userData.phone_number,
        is_active: true,
        role_id: 3,
        avatar: "",
        relative_avatar_url: "",
      };

      if (req.files && req.files.avatar) {
        const avatar_file = req.files.avatar as UploadedFile;
        const result: any = await uploadImageToCloudinary(
          avatar_file.data,
          "user_avatar"
        );
        newUser.avatar = result.secure_url;
        newUser.relative_avatar_url = result.public_id;
      }

      const createdUser = await UserService.createUser(newUser);

      res.status(201).json({
        message: "Voluntario registrado correctamente",
        user: {
          user_id: createdUser.user_id.toString("hex"),
          firstname: createdUser.firstname,
          surname: createdUser.surname,
          email: createdUser.email,
          avatar: createdUser.avatar,
        },
      });
    } catch (err: any) {
      console.error("Controller | Cannot register volunteer: ", err);
      res.status(500).json({
        message: `Error interno al registrar el voluntario: ${err.message}`,
      });
    }
  }

  async forgotPasswordEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      const user = await UserService.findUserByEmail(email);

      // Siempre devolver el mismo mensaje por seguridad
      const successMessage =
        "Si existe un usuario registrado con este correo, se enviará un enlace para restablecer la contraseña.";

      if (!user) {
        res.status(200).json({ message: successMessage });
        return;
      }

      // Generar token
      const token = await UserService.generatePasswordResetToken(
        user.user_id.toString("hex")
      );

      // Construir URL de restablecimiento
      const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

      // Leer la plantilla HTML
      const templatePath = path.join(
        __dirname,
        "../email/forgottedPassword.html"
      );
      let htmlContent = await fs.readFile(templatePath, "utf-8");

      // Reemplazar valores en la plantilla
      htmlContent = htmlContent
        .replace(/{{resetLink}}/g, resetUrl);

      // Enviar el correo
      await sendEmail(
        user.email,
        "Restablecimiento de contraseña",
        htmlContent
      );

      // Responder con mensaje de éxito
      res.status(200).json({ message: successMessage });
    } catch (err: any) {
      console.error("Error en forgotPasswordEmail:", err);

      // Enviar respuesta genérica de error
      res.status(500).json({
        message:
          "Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo más tarde.",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Error al cerrar la sesión" });
      } else {
        res.clearCookie("connect.sid", { path: "/" });
        res.status(200).json({ message: "Sesión cerrada correctamente" });
      }
    });
  }
}

export default new AuthController();
