"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "../../services/api";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authAPI.register({ name, email, password });
      router.push("/jogo");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao cadastrar";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 font-sans">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Criar Conta</h1>
        
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="border border-yellow-300 rounded px-4 py-2 focus:outline-yellow-500"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="border border-yellow-300 rounded px-4 py-2 focus:outline-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="border border-yellow-300 rounded px-4 py-2 focus:outline-yellow-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-2 rounded transition disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-yellow-800">
          Já tem conta?{" "}
          <Link href="/login" className="underline font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
} 