import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router()

router.route('/login')
    .post(AuthController.login)

export default router;
