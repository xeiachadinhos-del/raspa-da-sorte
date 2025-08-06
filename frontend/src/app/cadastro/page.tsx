"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "../../services/api";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  // Validação em tempo real
  const validateForm = useCallback(() => {
    const nameValid = name.length >= 3;
    const emailValid = email.includes('@') && email.length > 5;
    const passwordValid = password.length >= 6;
    setIsValid(nameValid && emailValid && passwordValid);
  }, [name, email, password]);

  // Debounce para validação
  useMemo(() => {
    const timeoutId = setTimeout(validateForm, 100);
    return () => clearTimeout(timeoutId);
  }, [name, email, password, validateForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isValid) {
      setError("Por favor, preencha todos os campos corretamente");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Feedback visual imediato
      const button = e.currentTarget.querySelector('button[type="submit"]');
      if (button) {
        button.textContent = "Cadastrando...";
        button.disabled = true;
      }

      // Cache do token para acesso rápido
      const startTime = Date.now();
      
      const response = await authAPI.register({ name, email, password });
      
      const endTime = Date.now();
      console.log(`Cadastro realizado em ${endTime - startTime}ms`);

      // Navegação otimizada
      router.push("/jogo");
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao cadastrar";
      setError(errorMessage);
      
      // Reativar botão em caso de erro
      const button = e.currentTarget.querySelector('button[type="submit"]');
      if (button) {
        button.textContent = "Cadastrar";
        button.disabled = false;
      }
    } finally {
      setLoading(false);
    }
  }, [name, email, password, isValid, router]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError("");
  }, [error]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  }, [error]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 font-sans">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Criar Conta</h1>
        
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={handleNameChange}
              className={`border rounded px-4 py-2 focus:outline-none transition-all duration-200 ${
                name.length > 0 
                  ? name.length >= 3 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-yellow-300 focus:border-yellow-500'
              }`}
              required
              autoComplete="name"
            />
            {name.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {name.length >= 3 ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
              className={`border rounded px-4 py-2 focus:outline-none transition-all duration-200 ${
                email.length > 0 
                  ? email.includes('@') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-yellow-300 focus:border-yellow-500'
              }`}
              required
              autoComplete="email"
            />
            {email.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {email.includes('@') ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
              className={`border rounded px-4 py-2 focus:outline-none transition-all duration-200 ${
                password.length > 0 
                  ? password.length >= 6 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-yellow-300 focus:border-yellow-500'
              }`}
              required
              autoComplete="new-password"
            />
            {password.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {password.length >= 6 ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className={`font-bold py-2 rounded transition-all duration-200 ${
              isValid && !loading
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white transform hover:scale-105'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cadastrando...
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-yellow-800">
          Já tem conta?{" "}
          <Link href="/login" className="underline font-semibold hover:text-yellow-600 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
} 