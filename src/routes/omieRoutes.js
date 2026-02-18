import { Router } from "express";
import OmieController from "../controllers/OmieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = Router();

router.route('/produtos')
    .get(AuthMiddleware.verifyToken, OmieController.getProdutosLocais)
    .post(AuthMiddleware.verifyToken, OmieController.upsertProduto)
    .patch(AuthMiddleware.verifyToken, OmieController.updateStatusProduto)

export default router;