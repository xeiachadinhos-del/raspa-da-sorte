'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-06');

  // Dados mockados baseados na imagem
  const dashboardData = {
    totalDeposits: 465,
    paidDepositValue: 11623.00,
    pendingDeposits: 5618.00,
    gamesPlayed: 0,
    registeredUsers: 4709,
    pendingUserWithdrawals: 11,
    approvedUserWithdrawals: 2,
    pendingAffiliateWithdrawals: 2,
    approvedAffiliateWithdrawals: 11,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema e métricas principais</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtro por Período</h2>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Filtrar
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Resetar
            </button>
          </div>
          <div className="ml-4">
            <span className="text-sm text-gray-600">
              Período Selecionado: {new Date(startDate).toLocaleDateString('pt-BR')} até {new Date(endDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TOTAL DE DEPÓSITOS</h3>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(dashboardData.totalDeposits)}</p>
          <p className="text-sm text-gray-600 mt-2">No período selecionado</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">VALOR DEPÓSITOS PAGOS</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(dashboardData.paidDepositValue)}</p>
          <p className="text-sm text-gray-600 mt-2">No período: {new Date(startDate).toLocaleDateString('pt-BR')} - {new Date(endDate).toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DEPÓSITOS PENDENTES</h3>
          <p className="text-3xl font-bold text-orange-600">{formatCurrency(dashboardData.pendingDeposits)}</p>
          <p className="text-sm text-gray-600 mt-2">Criados no período</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">JOGADAS NO PERÍODO</h3>
          <p className="text-3xl font-bold text-purple-600">{formatNumber(dashboardData.gamesPlayed)}</p>
          <p className="text-sm text-gray-600 mt-2">Jogos ativos: 0</p>
        </div>

        {/* Row 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">USUÁRIOS CADASTRADOS</h3>
          <p className="text-3xl font-bold text-indigo-600">{formatNumber(dashboardData.registeredUsers)}</p>
          <p className="text-sm text-gray-600 mt-2">No período / Total geral: {formatNumber(dashboardData.registeredUsers)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SAQUES USUÁRIOS PENDENTES</h3>
          <p className="text-3xl font-bold text-orange-600">{formatNumber(dashboardData.pendingUserWithdrawals)}</p>
          <p className="text-sm text-gray-600 mt-2">Criados no período</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SAQUES USUÁRIOS APROVADOS</h3>
          <p className="text-3xl font-bold text-green-600">{formatNumber(dashboardData.approvedUserWithdrawals)}</p>
          <p className="text-sm text-gray-600 mt-2">Aprovados no período</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SAQUES AFILIADOS PENDENTES</h3>
          <p className="text-3xl font-bold text-orange-600">{formatNumber(dashboardData.pendingAffiliateWithdrawals)}</p>
          <p className="text-sm text-gray-600 mt-2">Criados no período</p>
        </div>

        {/* Row 3 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SAQUES AFILIADOS APROVADOS</h3>
          <p className="text-3xl font-bold text-green-600">{formatNumber(dashboardData.approvedAffiliateWithdrawals)}</p>
          <p className="text-sm text-gray-600 mt-2">Aprovados no período</p>
        </div>
      </div>
    </div>
  );
} 