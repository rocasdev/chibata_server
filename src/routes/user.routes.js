import { Router } from "express";
import { delUser, getUser, getUsers, postUser, putUser } from "../controllers/user.controller.js";

const router = Router()

router.get('/api/user/', getUsers)
router.get('/api/user/:id', getUser)
router.post('/api/user/', postUser)
router.put('/api/user/:id', putUser)
router.delete('/api/user/:id', delUser)


export default router