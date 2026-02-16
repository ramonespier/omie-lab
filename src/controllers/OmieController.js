import OmieService from "../services/OmieService.js"

export default class OmieController {
    static async getClientes (req, res) {
        try {
            const data = await OmieService.listarClientes(1)
            return res.status(200).json(data)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}