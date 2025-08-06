'use client';

import { useState } from 'react';

export default function AdminUsuarios() {
  const [emailFilter, setEmailFilter] = useState('');
  const [orderBy, setOrderBy] = useState('ID (Mais recente)');
  const [onlyDepositors, setOnlyDepositors] = useState(false);

  // Dados mockados baseados na imagem
  const userStats = {
    totalUsers: 4710,
    totalBalance: 2767.00,
    depositors: 1266,
    registrationsToday: 268
  };

  const users = [
    {
      id: 4981,
      name: 'Samara costa pereira',
      email: 'samcostta100@gmail.com',
      balance: 14.00,
      totalDeposited: 20.00,
      createdOn: '06/08/2025 20:20',
      referralId: 'ronielli69'
    },
    {
      id: 4980,
      name: 'Michelle Leal',
      email: 'lealmichelle1311@gmail.com',
      balance: 0.00,
      totalDeposited: 20.00,
      createdOn: '06/08/2025 20:10',
      referralId: 'dalillarubim24'
    },
    {
      id: 4979,
      name: 'KARLA CAROLINE DOS SANTOS SAMENESES',
      email: 'karlasameneses@gmail.com',
      balance: 19.50,
      totalDeposited: 40.00,
      createdOn: '06/08/2025 20:10',
      referralId: 'dalillarubim24'
    },
    {
      id: 4978,
      name: 'Rafaela',
      email: 'rafaelabelizario03@gmail.com',
      balance: 0.00,
      totalDeposited: 0.00,
      createdOn: '06/08/2025 20:08',
      referralId: 'dalillarubim24'
    },
    {
      id: 4977,
      name: 'Priscila Silva',
      email: 'prisciladorei5@gmail.com',
      balance: 0.50,
      totalDeposited: 20.00,
      createdOn: '06/08/2025 20:05',
      referralId: 'dalillarubim24'
    }
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        <div className="text-sm text-gray-600">
          Total: {formatNumber(userStats.totalUsers)} usuário(s)
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TOTAL DE USUÁRIOS</h3>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(userStats.totalUsers)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SALDO TOTAL</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(userStats.totalBalance)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DEPOSITANTES</h3>
          <p className="text-3xl font-bold text-orange-600">{formatNumber(userStats.depositors)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">CADASTROS HOJE</h3>
          <p className="text-3xl font-bold text-purple-600">{formatNumber(userStats.registrationsToday)}</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Pesquisa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Email</label>
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Digite o email do usuário..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>ID (Mais recente)</option>
              <option>ID (Mais antigo)</option>
              <option>Nome (A-Z)</option>
              <option>Nome (Z-A)</option>
              <option>Saldo (Maior)</option>
              <option>Saldo (Menor)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={onlyDepositors}
                onChange={(e) => setOnlyDepositors(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Apenas usuários que depositaram</span>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Filtrar
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            Limpar
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Usuários</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USUÁRIO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALDO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL DEPOSITADO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRIADO EM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REFERRAL ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(user.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(user.totalDeposited)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.createdOn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.referralId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-900">
                      Editar Saldo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 