import cron from "node-cron";
import OmieProductService from "../services/OmieProductService.js";

const setupCronJobs = () => {
    // Agendamento: '0 */4 * * *' -> Executa a cada 4 horas
    // Se quiser testar agora, use '* * * * *' (a cada minuto)
    // Formato: (minuto hora dia mes dia-da-semana)

    cron.schedule('* * * * *', async () => {
        const now = new Date().toLocaleDateString("pt-BR");
        console.log(`[${now}] 🕒 Iniciando sincronização automática com Omie...`)

        try {
            const start = Date.now();
            const result = await OmieProductService.syncFromOmie()
            const duration = (Date.now() - start) / 1000;

            console.log(`[${now}] ✅ Sync automático finalizado com sucesso!`);
            console.log(`📦 Itens processados: ${result.total} em ${duration}s`);

        } catch (error) {
            console.error(`[${now}] ❌ Erro no Job de Sincronização:`, error.message);
        }
    })

    console.log("🚀 Agendador de tarefas (Cron) iniciado!");
}    

export default setupCronJobs;