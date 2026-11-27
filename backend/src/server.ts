import "dotenv/config";
import app from "./app.js";
import { startCleanupService, cleanupAbandonedSources } from "./services/cleanupService.js";

const PORT = Number(process.env.PORT) || 3333;

async function startServer(): Promise<void> {
  try {
    await cleanupAbandonedSources();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Servidor rodando na porta ${PORT}`
      );

      startCleanupService();
    });
  } catch (error) {
    console.error(
      "Erro ao iniciar o servidor:",
      error
    );

    process.exit(1);
  }
}

void startServer();