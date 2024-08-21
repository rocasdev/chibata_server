import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Role } from "../models/role.model.js";

dotenv.config();

class AuthController {
    static async login(req, res) {
        try {
            const { email, pass } = req.body;
            const user = await User.findOne({ where: { email } , include: [{
              model: Role,
              attributes: ['role_name']
            }]});

            if (user) {
                const isMatch = await user.comparePassword(pass); // Usando el método de instancia
                if (isMatch) {
                    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
                        expiresIn: "1h",
                    });

                    return res.status(201).json({
                        message: "Inicio de sesión exitoso",
                        token,
                        user: {
                            id: user.user_id,
                            name: user.name,
                            surname: user.surname,
                            email: user.email,
                            role_id: user.role_id,
                            role_name: user.Role.role_name
                        },
                    });
                } else {
                    return res.status(401).json({ message: "Verifica tus credenciales" });
                }
            } else {
                return res.status(401).json({ message: "Verifica tus credenciales" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al iniciar sesión: " + error });
        }
    }
}

export default AuthController;