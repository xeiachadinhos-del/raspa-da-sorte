"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI, gamificationAPI, utils } from "../../services/api";

interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  requirement: number;
  reward: number;
  icon: string;
  progress: number;
  completed: boolean;
  completedAt: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  level: number;
  xp: number;
}

export default function Conquistas() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [userData, achievementsData] = await Promise.all([
        authAPI.getUser(),
        gamificationAPI.getAchievements()
      ]);
      
      setUser(userData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar conquistas");
    } finally {
      setLoading(false);
    }
  };

  const handleDailyLogin = async () => {
    try {
      const result = await gamificationAPI.dailyLogin();
      setUser(result.user);
      alert(result.message);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login diário";
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push("/");
  };

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case "DAILY": return "bg-blue-100 text-blue-800";
      case "WEEKLY": return "bg-purple-100 text-purple-800";
      case "MILESTONE": return "bg-green-100 text-green-800";
      case "SPECIAL": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-yellow-700">Raspa da Sorte</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Nível</div>
              <div className="text-xl font-bold text-blue-600">{user.level}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">XP</div>
              <div className="text-xl font-bold text-green-600">{user.xp}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Créditos</div>
              <div className="text-xl font-bold text-purple-600">{user.credits}</div>
            </div>
            <Link href="/jogo" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
              Jogar
            </Link>
            <Link href="/painel" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
              Painel
            </Link>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">🏆 Conquistas</h1>
          <p className="text-white text-lg mb-6">Complete desafios e ganhe recompensas!</p>
          
          {/* Login Diário */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">📅 Login Diário</h2>
            <p className="text-gray-600 mb-4">Faça login todos os dias para ganhar créditos grátis!</p>
            <button
              onClick={handleDailyLogin}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition"
            >
              Fazer Login Diário
            </button>
          </div>

          {/* Progresso Geral */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Seu Progresso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{completedAchievements}</div>
                <div className="text-gray-600">Conquistas Completas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalAchievements}</div>
                <div className="text-gray-600">Total de Conquistas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((completedAchievements / totalAchievements) * 100)}%
                </div>
                <div className="text-gray-600">Taxa de Conclusão</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de Conquistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                achievement.completed ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{achievement.icon}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAchievementTypeColor(achievement.type)}`}>
                  {achievement.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.name}</h3>
              <p className="text-gray-600 mb-4">{achievement.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{achievement.progress}/{achievement.requirement}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.completed ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${getProgressPercentage(achievement.progress, achievement.requirement)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Recompensa: <span className="font-bold text-green-600">+{achievement.reward} créditos</span>
                </div>
                {achievement.completed && (
                  <div className="text-green-500 text-2xl">✅</div>
                )}
              </div>
              
              {achievement.completed && achievement.completedAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Concluída em: {utils.formatDate(achievement.completedAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 