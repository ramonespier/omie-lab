import { Router } from "express";
import OmieController from "../controllers/OmieController.js";

const router = Router();

router.route('/produtos')
    .get(OmieController.getProdutosLocais)
    .post(OmieController.upsertProduto)
    .patch(OmieController.updateStatusProduto)

export default router;