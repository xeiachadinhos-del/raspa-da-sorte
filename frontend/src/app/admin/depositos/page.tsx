'use client';

import { useState } from 'react';

export default function AdminDepositos() {
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Dados mockados baseados na imagem
  const deposits = [
    {
      id: 2269,
      user: { name: 'Samara costa pereira', initial: 'S' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '019881b0-5556-741d-8...',
      date: '06/08/2025 20:21'
    },
    {
      id: 2268,
      user: { name: 'Maiara andre Portella', initial: 'M' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '019881aa-24fa-70ad-9...',
      date: '06/08/2025 20:14'
    },
    {
      id: 2267,
      user: { name: 'Michelle Leal', initial: 'M' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '019881a4-8f3e-6c9b-0...',
      date: '06/08/2025 19:57'
    },
    {
      id: 2266,
      user: { name: 'KARLA CAROLINE DOS SANTOS SAMENESES', initial: 'K' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '0198819e-2d82-68c8-1...',
      date: '06/08/2025 19:50'
    },
    {
      id: 2265,
      user: { name: 'Priscila Silva', initial: 'P' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '01988198-6bc6-64d6-2...',
      date: '06/08/2025 19:43'
    },
    {
      id: 2264,
      user: { name: 'Wesley Pereira silva', initial: 'W' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '01988192-a9aa-60e4-3...',
      date: '06/08/2025 19:36'
    },
    {
      id: 2263,
      user: { name: 'Ariana Gomes Torres', initial: 'A' },
      value: 'R$ 20,00',
      status: 'PAGO',
      transactionId: '0198818c-e68e-5cf2-4...',
      date: '06/08/2025 19:29'
    }
  ];

  const formatCurrency = (value: string) => {
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Depósitos</h1>
        <div className="text-sm text-gray-600">
          Total: {deposits.length} registros
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Pesquisa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Todos os status</option>
              <option>PAGO</option>
              <option>PENDENTE</option>
              <option>CANCELADO</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Nome ou email do usuário"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="dd/mm/aaaa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <span className="mr-2">🔍</span>
            Filtrar
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            Limpar
          </button>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Depósitos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USUÁRIO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALOR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR CODE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSACTION ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deposit.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {deposit.user.initial}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {deposit.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deposit.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver QR
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deposit.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deposit.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-gray-400 hover:text-gray-600">
                      👁️
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