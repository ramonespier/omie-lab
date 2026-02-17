import { Router } from "express";
import OmieController from "../controllers/OmieController.js";

const router = Router();

router.get("/produtos", OmieController.getProdutos);
router.post("/produtos", OmieController.upsertProduto)

export default router;