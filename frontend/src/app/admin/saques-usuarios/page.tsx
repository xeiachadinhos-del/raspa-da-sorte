'use client';

import { useState } from 'react';

export default function AdminSaquesUsuarios() {
  const [activeTab, setActiveTab] = useState('pending');

  // Dados mockados baseados na imagem
  const withdrawalStats = {
    pending: 11,
    approved: 2,
    rejected: 1,
    pendingValue: 863.00,
    approvedValue: 155.00
  };

  const withdrawals = [
    {
      id: 35,
      user: { name: 'Verônica Cristina', initial: 'V', email: 'vealmeida2015@gmail.com' },
      value: 40.00,
      pixKey: '10769966713',
      type: 'CPF',
      holder: 'Verônica Cristina',
      date: '06/08/2025 18:26'
    },
    {
      id: 34,
      user: { name: 'Jonathas de Sousa Ferreira', initial: 'J', email: 'jonathassousa653@gmail.com' },
      value: 40.00,
      pixKey: '86999838401',
      type: 'CPF',
      holder: 'Jonathas de Sousa Ferreira',
      date: '06/08/2025 18:26'
    },
    {
      id: 33,
      user: { name: 'Ariany Souza', initial: 'A', email: 'andradearianne96@gmail.com' },
      value: 40.00,
      pixKey: '21983049766',
      type: 'CPF',
      holder: 'Ariany Souza',
      date: '03/08/2025 12:41'
    },
    {
      id: 32,
      user: { name: 'Robson andre', initial: 'R', email: 'robsonsena31@gmail.com' },
      value: 51.00,
      pixKey: '11064611699',
      type: 'CPF',
      holder: 'Robson andre',
      date: '01/08/2025 14:54'
    },
    {
      id: 31,
      user: { name: 'Franciane Neves Ferreira', initial: 'F', email: 'francianesuyanne123@gmail.com' },
      value: 45.00,
      pixKey: '16525902770',
      type: 'CPF',
      holder: 'Franciane Neves Ferreira',
      date: '01/08/2025 01:09'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Saques Usuários</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">PENDENTES</h3>
          <p className="text-3xl font-bold text-orange-600">{withdrawalStats.pending}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">APROVADOS</h3>
          <p className="text-3xl font-bold text-green-600">{withdrawalStats.approved}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">RECUSADOS</h3>
          <p className="text-3xl font-bold text-red-600">{withdrawalStats.rejected}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">VALOR PENDENTE</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(withdrawalStats.pendingValue)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">VALOR APROVADO</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(withdrawalStats.approvedValue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Saques Pendentes {withdrawalStats.pending}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Histórico 3
            </button>
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USUÁRIO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALOR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHAVE PIX</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITULAR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {withdrawal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {withdrawal.user.initial}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {withdrawal.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {withdrawal.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(withdrawal.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {withdrawal.pixKey}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {withdrawal.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {withdrawal.holder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {withdrawal.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        Observações
                      </button>
                      <button className="text-green-600 hover:text-green-900 font-medium">
                        ✓ Aprovar
                      </button>
                      <button className="text-red-600 hover:text-red-900 font-medium">
                        X Recusar
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Motivo recusa
                    </div>
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