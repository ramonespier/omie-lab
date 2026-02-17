import OmieProductService from "../services/OmieProductService.js";
import { ZodError } from "zod";

export default class OmieController {
    static async getProdutos(req, res) {
        try {
            const data = await OmieProductService.listarProdutos(1)
            return res.status(200).json(data)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async upsertProduto(req, res) {
        try {
            const produto = await OmieProductService.upsert(req.body)

            return res.status(201).json({
                message: "Produto sincronizado com sucesso",
                data: produto
            })

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors.map(err => ({
                        campo: err.path[0],
                        mensagem: err.message
                    }))
                })
            }

            // Erros de negócio da Omie ou do Banco
            console.error("Erro no controller de Produto:", error.message);
            return res.status(500).json({
                error: "Falha na sincronização",
                message: error.message
            })
        }
    }
}