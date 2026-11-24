import "dotenv/config";
import app from "./app.js";
import { startCleanupService } from "./services/cleanupService.js";

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  startCleanupService();
});