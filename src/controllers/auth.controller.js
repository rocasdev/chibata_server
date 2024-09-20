import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import { OrganizationMember } from "../models/orgnazation_member.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CDY_CLOUD_NAME,
  api_key: process.env.CDY_API_KEY,
  api_secret: process.env.CDY_API_SECRET,
  secure: true,
});

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(buffer);
  readable.push(null);
  return readable;
};
class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.getOneUser(email);

      if (user) {
        const isMatch = await user.comparePassword(password); // Usando el método de instancia
        if (isMatch) {
          const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 3600000,
          });

          return res.status(201).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
              id: user.user_id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              profile_photo: user.profile_photo,
              role_name: user.Role.role_name,
              role_path: user.Role.role_path,
            },
          });
        } else {
          return res.status(401).json({ message: "Verifica tus credenciales" });
        }
      } else {
        return res.status(401).json({ message: "Verifica tus credenciales" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error en el servidor al iniciar sesión" });
    }
  }

  static async registerVolunteer(req, res) {
    try {
      if (!req.files || !req.files.profile_photo) {
        const u = {
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          doc_type: req.body.doc_type,
          doc_num: req.body.doc_num,
          phone_number: req.body.phone_number,
          pass: req.body.pass,
          role_id: 3,
          state: 1,
        };

        console.log(u);

        await User.createUser(u);
        return res
          .status(200)
          .json({ message: "Usuario creado correctamente" });
      }

      const uploadedFile = req.files.profile_photo;

      const fileStream = bufferToStream(uploadedFile.data);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "user_avatar" },
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
        role_id: 3,
        profile_photo: result.secure_url,
        relative_photo_url: result.public_id,
        state: req.body.state,
      };

      await User.createUser(u);
      return res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return res.status(500).json({
        message: "Error al crear el usuario: " + (error.message || error),
      });
    }
  }

  static async registerOrganization(req, res) {
    const t = await sequelize.transaction(); // Inicia una transacción

    try {
      const createUserAndOrg = async (userData, orgData) => {
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);
        userData.pass = hashedPassword;

        // Crear usuario
        const newUser = await User.create(userData, { transaction: t });
        if (!newUser || !newUser.user_id) {
          throw new Error("Failed to create user: No user ID returned");
        }
        const userId = newUser.user_id;

        // Crear organización
        const newOrganization = await Organization.create(orgData, {
          transaction: t,
        });
        if (!newOrganization || !newOrganization.organization_id) {
          throw new Error(
            "Failed to create organization: No organization ID returned"
          );
        }
        const organizationId = newOrganization.organization_id;

        // Verificar datos antes de insertar el miembro
        if (!userId || !organizationId) {
          throw new Error("User ID or Organization ID is missing.");
        }

        // Crear miembro de la organización
        const memberResult = await OrganizationMember.create(
          {
            user_id: userId,
            organization_id: organizationId,
          },
          { transaction: t }
        );
        if (!memberResult || !memberResult.member_id) {
          throw new Error("Failed to create organization member");
        }
      };

      const userData = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        doc_type: req.body.doc_type,
        doc_num: req.body.doc_num,
        phone_number: req.body.phone_number,
        pass: req.body.pass,
        role_id: 2, // Puedes ajustar este valor según tus necesidades
        state: 1,
      };

      const orgData = {
        organization_name: req.body.org_name,
        nit: req.body.nit,
        address: req.body.address,
        registration_date: req.body.registration_date,
        contact_number: req.body.contact_number,
        website: req.body.website,
      };

      // Subir imagen de perfil si está presente
      if (req.files && req.files.profile_photo) {
        const uploadedFile = req.files.profile_photo;
        const fileStream = bufferToStream(uploadedFile.data);

        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "user_avatar" },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
          fileStream.pipe(uploadStream);
        });

        // Guardar la URL de la imagen en el objeto de usuario
        userData.profile_photo_url = result.secure_url;
        userData.profile_photo_path = result.public_id; // Guardar la ruta relativa
      }

      await createUserAndOrg(userData, orgData);
      await t.commit(); // Confirmar la transacción

      return res
        .status(200)
        .json({ message: "Usuario y organización creados correctamente" });
    } catch (error) {
      await t.rollback(); // Revertir la transacción en caso de error
      console.error(
        "Error detallado al crear el usuario y la organización:",
        error
      );
      return res.status(500).json({
        message: "Error al crear el usuario y la organización",
        error: error.message,
        stack: error.stack,
      });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("auth_token", {
        httpOnly: true,
      });
      return res.status(200).json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return res
        .status(500)
        .json({ message: "Error en el servidor al cerrar sesión" });
    }
  }
}

export default AuthController;
