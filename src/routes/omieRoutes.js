import { Router } from "express";
import OmieController from "../controllers/OmieController.js";

const router = Router();

router.get("/clientes", OmieController.getClientes);

export default router;