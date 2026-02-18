import { Router } from "express";
import OmieController from "../controllers/OmieController.js";

const router = Router();

router.get("/produtos", OmieController.getProdutosLocais);
router.post("/produtos", OmieController.upsertProduto) // UPDATE OU CREATE
router.patch("/produtos/:id", OmieController.updateStatusProduto)

export default router;