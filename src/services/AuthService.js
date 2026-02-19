import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
    static async generateSession(email) {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error("E-mail autorizado, mas não encontrado no banco local");
            error.status = 404;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        return { token, user }
    };
}


export default AuthService;