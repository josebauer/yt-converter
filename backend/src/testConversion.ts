import "dotenv/config";
import path from "node:path";
import { access } from "node:fs/promises";
import { convertMedia } from "./services/converterService.js";

async function main() {
  const inputPath = path.resolve("temp", "teste.mp4");

  console.log("Arquivo de entrada:", inputPath);

  await access(inputPath);

  const result = await convertMedia(inputPath, "mp3");

  console.log("Conversão concluída!");
  console.log("Arquivo:", result.outputPath);
}

main().catch((error) => {
  console.error("Erro na conversão:", error);
  process.exitCode = 1;
});