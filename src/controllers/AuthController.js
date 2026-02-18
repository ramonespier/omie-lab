import AuthService from "../services/AuthService.js";

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const { token } = await AuthService.authenticate(email, password);

            return res.status(200).json({ message: "Login realizado com sucesso!", token })
        } catch (error) {
            const status = error.status || 500;
            const message = error.status ? error.message : "Ocorreu um erro interno no servidor.";

            if (status === 500) {
                console.error("Erro no processo de login:", error)
            }

            return res.status(status).json({ error: message })
        }
    }
}

export default AuthController;