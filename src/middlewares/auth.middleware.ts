import { Request, Response, NextFunction } from "express";

class AuthMiddleware {
  public isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if(req.session.user_id && req.session.role_id) {
      next();
    }else {
      res.status(401).json({ message: "Inicia sesión para acceder a esta ruta" });
    }
  }

  public isAdmin(req: Request, res: Response, next: NextFunction): void {
    if(req.session.role_id === 1) {
      next();
    }else {
      res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
    }
  }
}

export default new AuthMiddleware();