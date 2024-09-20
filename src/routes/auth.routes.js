import { Router } from "express";
import AuthController from "../controllers/auth.controller.js"; 

const router = Router()

router.post('/api/auth/login/', AuthController.login)
router.post('/api/auth/registerv', AuthController.registerVolunteer)
router.post('/api/auth/registerorg', AuthController.registerOrganization)
router.post('/api/auth/logout', AuthController.logout);

export default router