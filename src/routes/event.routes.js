import { Router } from "express";
import EventController from "../controllers/event.controller.js"; 
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router()

router.get('/api/events/', authMiddleware, EventController.getEvents)
router.get('/api/events/:id', authMiddleware, EventController.getEvent)
router.patch('/api/events/:id', authMiddleware, EventController.toggleEventStatus)
router.put('/api/events/:id', authMiddleware, EventController.putEvent)
router.post('/api/events/', authMiddleware, EventController.postEvent)

export default router