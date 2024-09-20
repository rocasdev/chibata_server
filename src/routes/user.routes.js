import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router()

router.get('/api/user/', authMiddleware, UserController.getUsers)
router.get('/api/user/me', authMiddleware, UserController.getLoggedUser)
router.get('/api/user/:id', authMiddleware, UserController.getUser)
router.post('/api/user/', UserController.postUser)
router.put('/api/user/:id', authMiddleware, UserController.putUser)
router.patch('/api/user/:id', authMiddleware, UserController.patchUser)

export default router