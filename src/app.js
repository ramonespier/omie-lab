import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import cors from 'cors'
import omieRoutes from './routes/omieRoutes.js'
import { sequelize } from './models/index.js';
import setupCronJobs from './jobs/syncJob.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão OK");

        // await sequelize.sync({ alter: true });
        // console.log("✅ Tabelas sincronizadas");

    } catch (err) {
        console.error("❌ Erro:", err);
    }
})();

const app = express();

setupCronJobs();

const PORT = process.env.PORT || 3001
const allowedOrigins = [process.env.DEV_BACK_PORT, process.env.DEV_FRONT_PORT]

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Origem não permitida"))
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.status(200).json({ message: "Servidor ligado" })
})

app.use('/omie', omieRoutes)

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: ", PORT)
})