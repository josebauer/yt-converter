
"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  async function testConnection() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/converter/test`
      );

      if (!response.ok) {
        throw new Error("Erro na comunicação com a API");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Não foi possível conectar ao backend.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">
        YT Converter
      </h1>

      <button
        onClick={testConnection}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Testar conexão
      </button>

      <p>{message}</p>
    </main>
  );
}
