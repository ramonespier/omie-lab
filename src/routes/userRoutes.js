import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router()

router.route('/login')
    .post(AuthController.requestLogin)

router.get('/callback', AuthController.authenticateCallback)

export default router;
