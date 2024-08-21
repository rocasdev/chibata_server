import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Adjunta la información del usuario decodificada al objeto de la solicitud (req)
    next(); // Continua hacia la siguiente función en la pila de middleware o la ruta
  } catch (error) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
};

export default authMiddleware;