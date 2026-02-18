import bcrypt from "bcryptjs"
import User from "../models/User.js"
import sequelize from "../config/database.js"

async function seed() {

    try {
        await sequelize.authenticate();
        User.initModel(sequelize)
        await User.sync()

        const name = 'ramon'
        const email = "ramon.coelhomelo@gmail.com"
        const password = 'senha123'

        const exists = await User.findOne({ where: { email } })

        if (exists) {
            console.log("Usuário já cadastrado.")
            return;
        }


        await User.create({
            name: name,
            email: email,
            password: password
        })

        console.log(`✅ Usuário '${name}' criado com sucesso!`);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
    } finally {
        process.exit();
    }
}

seed();