import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

class AuthService {
    static async authenticate(email, password) {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error("Usuário não encontrado");
            error.status = 404;
            throw error;
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            const error = new Error("Senha incorreta.")
            error.status(401);
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10h'}
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
}

export default AuthService;