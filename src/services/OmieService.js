import axios from "axios";

const OMIE_URL_CLIENTES = "https://app.omie.com.br/api/v1/geral/clientes/"
const OMIE_URL_PRODUTOS = "https://app.omie.com.br/api/v1/geral/produtos/"

const keys = [{

}]

export default class OmieService {
    static async listarClientes(pagina = 1) {
        try {
            const response = await axios.post(OMIE_URL_CLIENTES, {
                call: "ListarClientesResumido",
                app_key: process.env.OMIE_APP_KEY,
                app_secret: process.env.OMIE_APP_SECRET,
                param: [{
                    pagina,
                    registros_por_pagina: 20
                }],
            })

            return response.data
        } catch (error) {
            console.error("Erro Omie: ", error.response?.data || error.message)
            throw new Error('Erro ao buscar clientes no Omie')
        }
    }

    static async listarProdutos(pagina = 1) {
        try {
            const response = await axios.post(OMIE_URL_PRODUTOS, {
                call: "ListarProdutosResumido",
                app_key: process.env.OMIE_APP_KEY,
                app_secret: process.env.OMIE_APP_SECRET,
                param: [{
                    pagina,
                    registros_por_pagina: 20
                }],
            })

            return response.data;
        } catch (error) {
            console.error("Erro Omie: ", error.response?.data || error.message);
            throw new Error("Erro ao buscar produtos no Omie");
        }
    }
}
