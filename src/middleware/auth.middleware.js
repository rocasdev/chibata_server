import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Accede a la cookie que contiene el token JWT
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.logged_user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
};

export default authMiddleware;