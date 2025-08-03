'use client';

import React, { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  credits: number;
  isBlocked: boolean;
  createdAt: string;
  totalWinnings: number;
  totalGames: number;
}

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalPayouts: number;
  winRate: number;
  activeUsers: number;
}

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'payouts'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [winRate, setWinRate] = useState(30);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      await adminAPI.blockUser(userId, blocked);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBlocked: blocked } : user
      ));
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error);
    }
  };

  const handleUpdateWinRate = async () => {
    try {
      await adminAPI.updateWinRate(winRate);
      alert('Taxa de vitória atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar taxa de vitória:', error);
    }
  };

  const handleApprovePayout = async (userId: string, amount: number) => {
    try {
      await adminAPI.approvePayout(userId, amount);
      alert('Saque aprovado com sucesso!');
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao aprovar saque:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🔧 Painel Administrativo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'users', label: '👥 Usuários', icon: '👥' },
            { id: 'settings', label: '⚙️ Configurações', icon: '⚙️' },
            { id: 'payouts', label: '💰 Saques', icon: '💰' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-500 rounded-lg">
                  <span className="text-white text-xl">💸</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Pagamentos</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalPayouts)}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Taxa de Vitória</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.winRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganhos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">Criado em {formatDate(user.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(user.balance)}</div>
                      <div className="text-sm text-gray-500">{user.credits} créditos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalGames}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(user.totalWinnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isBlocked ? 'Bloqueado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                        className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
                          user.isBlocked
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Configurações do Jogo</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Vitória (%)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={winRate}
                      onChange={(e) => setWinRate(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-green-600 w-16">{winRate}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Porcentagem de usuários que ganham em cada jogo
                  </p>
                </div>

                <button
                  onClick={handleUpdateWinRate}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Estatísticas do Sistema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Usuários Ativos Hoje</h4>
                  <p className="text-2xl font-bold text-blue-600">{stats?.activeUsers || 0}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Receita Hoje</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Solicitações de Saque</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Aqui você pode adicionar as solicitações de saque */}
                    <tr className="text-center text-gray-500 py-8">
                      <td colSpan={5}>Nenhuma solicitação de saque pendente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 