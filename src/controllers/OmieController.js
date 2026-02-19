import Produto from "../models/Produto.js";
import OmieProductService from "../services/OmieProductService.js";
import { ZodError } from "zod";

export default class OmieController {
    static async getProdutosLocais(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;

            const produtos = await Produto.findAndCountAll({
                offset: (page - 1) * limit,
                limit: parseInt(limit),
                order: [['descricao', 'ASC']]
            })

            return res.status(200).json(produtos)

            // const data = await OmieProductService.listarProdutos(1)
            // return res.status(200).json(data)

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async upsertProduto(req, res) {
        try {
            const produto = await OmieProductService.upsert(req.body)

            return res.status(200).json({
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

    static async updateStatusProduto(req, res) {
        try {
            const { id } = req.params;
            const { ativo } = req.body;

            if (typeof ativo !== "boolean") {
                return res.status(400).json({ error: "O campo 'ativo' deve ser um booleano." })
            }

            const produto = await OmieProductService.setStatus(id, ativo);

            return res.status(200).json({
                message: `Produto ${ativo ? 'ativado' : 'inativado'} com sucesso`,
                data: produto
            });
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async sync(req, res) {
        try {
            const resultado = await OmieProductService.syncFromOmie();
            return res.status(200).json(resultado)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

}