import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const router = Router()

router.get('/api/user/', UserController.getUsers)
router.get('/api/user/:id', UserController.getUser)
router.post('/api/user/', UserController.postUser)
router.put('/api/user/:id', UserController.putUser)
router.patch('/api/user/:id', UserController.patchUser)

export default router