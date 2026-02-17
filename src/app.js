import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import cors from 'cors'
import omieRoutes from './routes/omieRoutes.js'
import { sequelize } from './models/index.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão OK");

        // await sequelize.sync({ force: true });
        // console.log("✅ Tabelas sincronizadas");

    } catch (err) {
        console.error("❌ Erro:", err);
    }
})();

const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Servidor ligado" })
})

app.use('/omie', omieRoutes)

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: ", PORT)
})