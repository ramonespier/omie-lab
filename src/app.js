import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import cors from 'cors'

import omieRoutes from './routes/omieRoutes.js'

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