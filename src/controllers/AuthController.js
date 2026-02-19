import stytchClient from "../config/stytch.js";
import User from "../models/User.js";
import AuthService from "../services/AuthService.js";

class AuthController {

    static async requestLogin(req, res) {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(401).json({ error: "E-mail não autorizado a acessar este sistema." })
        }

        try {
            await stytchClient.magicLinks.email.loginOrCreate({
                email: email,
                login_magic_link_url: process.env.STYTCH_CALLBACK_URL,
                signup_magic_link_url: process.env.STYTCH_CALLBACK_URL
            })

            return res.status(200).json({ message: "Verifique o seu email!" })

        } catch (error) {
            const status = error.status_code || 500;
            const message = error.error_message || "Ocorreu um erro interno no servidor.";

            if (status === 500) {
                console.error("Erro no processo de login:", error)
            }

            return res.status(status).json({ error: message })
        }
    }

    static async authenticateCallback(req, res) {
        console.log("Query: ", req.query)
        const { token } = req.query

        try {
            const stytchResp = await stytchClient.magicLinks.authenticate({
                token: token,
                session_duration_minutes: 600
            })

            const email = stytchResp.user.emails[0].email

            const { token: localToken, user } = await AuthService.generateSession(email);

            res.cookie("auth_token", localToken, {
                httpOnly: true,
                secure: false, // nao esquecer de colocar true em produção
                sameSite: "lax",
                maxAge: 10 * 60 * 60 * 1000 // 10h
            })

            return res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
        } catch (error) {
            console.error("Erro no callback do Stytch:", error);
            return res.status(401).json({ message: "Link de acesso inválido ou expirado" })
        }
    }
}

export default AuthController;