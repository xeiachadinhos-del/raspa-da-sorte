'use client';

import { useState } from 'react';

export default function AdminJogadas() {
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [gameFilter, setGameFilter] = useState('Todos os jogos');
  const [resultFilter, setResultFilter] = useState('Todos os resultados');
  const [affiliateFilter, setAffiliateFilter] = useState('');

  // Dados mockados baseados na imagem
  const gameStats = {
    totalPlays: 43373,
    totalWagered: 45222.00,
    totalWon: 13869.00,
    victories: 11706,
    losses: 31665,
    activeUsers: 1267
  };

  const games = [
    {
      id: 47601,
      user: 'Samara costa pereira',
      affiliate: 'ronielli69 ronnygones42@gmail.com',
      game: 'Raspadinha',
      demo: false,
      betAmount: 'R$ 1,00',
      winAmount: 'R$ 0,00',
      result: 'DERROTA',
      profitLoss: 'R$ -1,00',
      dateTime: '06/08/2025 20:23:32'
    },
    {
      id: 47600,
      user: 'Samara costa pereira',
      affiliate: '',
      game: 'Raspadinha',
      demo: false,
      betAmount: 'R$ 1,00',
      winAmount: 'R$ 0,00',
      result: 'DERROTA',
      profitLoss: 'R$ -1,00',
      dateTime: '06/08/2025 20:23:18'
    },
    {
      id: 47599,
      user: 'Samara costa pereira',
      affiliate: '',
      game: 'Raspadinha',
      demo: false,
      betAmount: 'R$ 1,00',
      winAmount: 'R$ 0,00',
      result: 'DERROTA',
      profitLoss: 'R$ -1,00',
      dateTime: '06/08/2025 20:23:03'
    },
    {
      id: 47598,
      user: 'Maiara andre Portella',
      affiliate: 'dalillarubim24 dalillarubim48@gmail.com',
      game: 'Raspadinha',
      demo: false,
      betAmount: 'R$ 1,00',
      winAmount: 'R$ 0,00',
      result: 'DERROTA',
      profitLoss: 'R$ -1,00',
      dateTime: '06/08/2025 20:22:22'
    },
    {
      id: 47597,
      user: 'Maiara andre Portella',
      affiliate: '',
      game: 'Raspadinha',
      demo: false,
      betAmount: 'R$ 0,00',
      winAmount: 'R$ 0,50',
      result: 'VITÓRIA',
      profitLoss: '+R$ 0,50',
      dateTime: '06/08/2025 20:22:18'
    }
  ];

  const formatCurrency = (value: string) => {
    return value;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Jogadas</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TOTAL DE JOGADAS</h3>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(gameStats.totalPlays)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TOTAL APOSTADO</h3>
          <p className="text-3xl font-bold text-orange-600">{formatCurrency(`R$ ${gameStats.totalWagered.toFixed(2).replace('.', ',')}`)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TOTAL GANHO</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(`R$ ${gameStats.totalWon.toFixed(2).replace('.', ',')}`)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">VITÓRIAS</h3>
          <p className="text-3xl font-bold text-green-600">{formatNumber(gameStats.victories)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DERROTAS</h3>
          <p className="text-3xl font-bold text-red-600">{formatNumber(gameStats.losses)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">USUÁRIOS ATIVOS</h3>
          <p className="text-3xl font-bold text-purple-600">{formatNumber(gameStats.activeUsers)}</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Pesquisa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jogo</label>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Todos os jogos</option>
              <option>Raspadinha</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Todos os resultados</option>
              <option>VITÓRIA</option>
              <option>DERROTA</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Afiliado</label>
            <input
              type="text"
              value={affiliateFilter}
              onChange={(e) => setAffiliateFilter(e.target.value)}
              placeholder="Email ou código do afiliado"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

      {/* Games Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Jogadas</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USUÁRIO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AFILIADO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOGO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEMO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALOR APOSTA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALOR GANHO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESULTADO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LUCRO/PREJUÍZO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA/HORA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {game.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.affiliate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.game}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.demo ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(game.betAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(game.winAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      game.result === 'VITÓRIA' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {game.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={game.profitLoss.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(game.profitLoss)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.dateTime}
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