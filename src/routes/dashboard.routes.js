import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller.js"; 
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router()

router.get("/api/dashboard/counts", authMiddleware, DashboardController.getCounts)
router.get("/api/notifications", authMiddleware, DashboardController.getUserNotifications)
router.get("/api/notifications/:id", authMiddleware, DashboardController.getNotification)
router.patch("/api/notifications/:id", authMiddleware, DashboardController.toggleReadState)
router.delete("/api/notifications/:id", authMiddleware, DashboardController.deleteNotification)

export default router