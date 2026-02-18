import jwt from "jsonwebtoken";

class AuthMiddleware {
    async verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Não autorizado: Token não fornecido" })
        }

        const [, token] = authHeader.split(' ')

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('Token decodificado: ', decoded)
            req.user = decoded;
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(403).json({ message: "Não autorizado: Token expirado." })
            }

            res.status(403).json({ message: "Não autorizado: token inválido."})
        }
    }
}

export default AuthMiddleware;

