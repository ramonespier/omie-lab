import axios from "axios";
import z from "zod";
import Produto from "../models/Produto.js";

const productSchema = z.object({
    codigo: z.string().min(1),
    descricao: z.string().min(1),
    unidade: z.string().max(6).default("UN"),
    valor_unitario: z.number().nonnegative().default(0),
    ncm: z.string().length(8).regex(/^\d+$/, "NCM deve ter 8 dígitos numéricos"),
});

const OMIE_URL = "https://app.omie.com.br/api/v1/geral/produtos/"

export default class OmieProductService {
    static mapToDatabase(item) {
        return {
            codigo: item.codigo_produto_integracao || item.codigo,
            descricao: item.descricao,
            unidade: item.unidade || "UN",
            valorUnitario: item.valor_unitario,
            ncm: item.ncm || "",
            omieProdutoId: item.codigo_produto_omie || item.codigo_produto,
            ativo: item.inativo === "N"
        }
    }

    static isSyncing = false;

    static async syncFromOmie() {
        let pagina = 1;
        let totalPaginas = 1;
        let registrosProcessados = 0;

        if (this.isSyncing) return { message: "Já em execução", total: 0 };

        try {

            this.isSyncing = true;

            do {
                console.log(`⏳ Sincronizando página ${pagina}...`);

                const response = await this.callOmie("ListarProdutosResumido", {
                    pagina: pagina,
                    registros_por_pagina: 50,
                    apenas_importado_api: "N",
                    filtrar_apenas_omiepdv: "N"
                })

                const produtosOmie = response.produto_servico_resumido || response.produto_servico_cadastro || [];

                if (produtosOmie.length > 0) {
                    for (const item of produtosOmie) {

                        const mapped = this.mapToDatabase(item);
                        await Produto.upsert(mapped)

                        registrosProcessados++;
                    }
                }

                totalPaginas = response.total_de_paginas || 0;
                pagina++;

                if (pagina <= totalPaginas) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // para nao dar too many requests
                }


            } while (pagina <= totalPaginas)


            return {
                message: "Sincronização concluída",
                total: registrosProcessados
            }

        } catch (error) {
            console.error("Erro no Sync:", error);
            throw new Error("Falha ao sincronizar base local com Omie")
        } finally {
            this.isSyncing = false;
        }
    }

    static async callOmie(call, param) {
        console.log(`>> Chamando Omie: ${call} | Param:`, JSON.stringify(param));
        try {
            const response = await axios.post(OMIE_URL, {
                call,
                app_key: process.env.OMIE_APP_KEY,
                app_secret: process.env.OMIE_APP_SECRET,
                param: [param],
            });

            if (response.data) {
                console.log(`[API Omie] ${call} - Registros nesta página: ${response.data.registros || 0} / Total: ${response.data.total_de_registros || 0}`);
            }

            if (response.data.faultcode) {
                throw new Error(`Erro Omie: ${response.data.faultstring}`)
            }

            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.faultstring || error.message;
            console.error("Erro na integração:", errorMsg);
            throw new Error(errorMsg);
        }
    }

    static async saveLocal(produtoLocal, data, omieId) {
        const mappedData = {
            codigo: data.codigo,
            descricao: data.descricao,
            unidade: data.unidade,
            valorUnitario: data.valor_unitario,
            ncm: data.ncm,
            omieProdutoId: omieId
        }

        if (!produtoLocal) {
            return await Produto.create({ ...data, omieProdutoId: omieId })
        }
        await Produto.update(mappedData, {
            where: { id: produtoLocal.id }
        })

        return await produtoLocal.reload();
    }

    static async upsert(data) { // coisa da omie, isso nao é rest
        const validated = productSchema.parse(data)
        let produtoLocal = await Produto.findOne({ where: { codigo: validated.codigo } })

        const payload = {
            codigo: validated.codigo,
            codigo_produto_integracao: validated.codigo,
            descricao: validated.descricao,
            unidade: validated.unidade,
            valor_unitario: validated.valor_unitario,
            ncm: validated.ncm
        }

        try {
            const response = await this.callOmie("IncluirProduto", payload);
            return await this.saveLocal(produtoLocal, validated, response.codigo_produto_omie)

        } catch (error) {
            // Tratamento especial: Se tentarmos incluir mas o produto já existir na Omie
            if (error.message.includes("já cadastrado")) {
                console.log("Produto já existe na Omie. Mudando para alterar produto...")

                const updateResponse = await this.callOmie("AlterarProduto", payload)
                const omieId = updateResponse.codigo_produto_omie || produtoLocal.omieProdutoId
                return await this.saveLocal(produtoLocal, validated, omieId)
            }

            throw error;
        }

    }

    static async setStatus(id, ativo) {
        const produto = await Produto.findByPk(id);

        if (!produto) {
            throw new Error("Produto não encontrado no banco local.")
        }

        const statusOmie = ativo ? "S" : "N";

        const payload = {
            codigo_produto_integracao: produto.codigo,
            codigo: Number(produto.omieProdutoId),
            inativo: statusOmie
        }

        try {
            await this.callOmie("AlterarProduto", payload);
            await produto.update({ ativo: ativo })
            return produto;

        } catch (error) {
            console.error("Erro ao alterar status na Omie:", error.message);
            throw error;
        }
    }

    static async listarProdutos(pagina = 1) {
        try {
            const response = await axios.post(OMIE_URL, {
                call: "ListarProdutos",
                app_key: process.env.OMIE_APP_KEY,
                app_secret: process.env.OMIE_APP_SECRET,
                param: [{
                    pagina,
                    registros_por_pagina: 20,
                    apenas_importado_api: "N",
                    filtrar_apenas_omiepdv: "N"
                }],
            })

            return response.data;
        } catch (error) {
            console.error("Erro Omie: ", error.response?.data || error.message);
            throw new Error("Erro ao buscar produtos no Omie");
        }
    }
}
