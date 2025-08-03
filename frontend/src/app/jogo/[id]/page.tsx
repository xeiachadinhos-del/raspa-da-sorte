'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ScratchCard from '@/components/ScratchCard';
import { authAPI } from '@/services/api';

interface GameData {
  id: string;
  title: string;
  maxPrize: string;
  price: string;
  banner: string;
  description: string;
}

const gamesData: { [key: string]: GameData } = {
  'raspadinha-1': {
    id: 'raspadinha-1',
    title: 'Raspadinha 1',
    maxPrize: 'R$ 100,00',
    price: 'R$ 0,50',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  },
  'raspadinha-2': {
    id: 'raspadinha-2',
    title: 'Raspadinha 2',
    maxPrize: 'R$ 200,00',
    price: 'R$ 1,00',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  },
  'raspadinha-3': {
    id: 'raspadinha-3',
    title: 'Raspadinha 3',
    maxPrize: 'R$ 500,00',
    price: 'R$ 2,50',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  },
  'raspadinha-4': {
    id: 'raspadinha-4',
    title: 'Raspadinha 4',
    maxPrize: 'R$ 1.000,00',
    price: 'R$ 5,00',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  },
  'raspadinha-5': {
    id: 'raspadinha-5',
    title: 'Raspadinha 5',
    maxPrize: 'R$ 2.000,00',
    price: 'R$ 10,00',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  },
  'raspadinha-6': {
    id: 'raspadinha-6',
    title: 'Raspadinha 6',
    maxPrize: 'R$ 5.000,00',
    price: 'R$ 25,00',
    banner: 'https://i.postimg.cc/NGWD1v8X/banner-raspapix.png',
    description: 'Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!'
  }
};

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = gamesData[gameId] || null;
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [currentGameSessionId, setCurrentGameSessionId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Verificar se o usuário está logado e carregar saldo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const isLoggedIn = !!(token && userData);
    setIsLoggedIn(isLoggedIn);
    
    if (isLoggedIn && userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setUserBalance(userObj.balance || 0);
    }
  }, []);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      setShowLoginSheet(false);
      setEmail('');
      setPassword('');
      setIsLoggedIn(true);
      setUserBalance(response.user.balance || 0);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({ name, email, password });
      setShowRegisterSheet(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsLoggedIn(true);
      setUserBalance(response.user.balance || 0);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    setUserBalance(0);
    setShowUserMenu(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleBuy = (gameSessionId: string) => {
    setCurrentGameSessionId(gameSessionId);
    setIsPlaying(true);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setUserBalance(newBalance);
    // Atualizar também no localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      userData.balance = newBalance;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handlePlayAgain = () => {
    // Implementar lógica de jogar novamente
    alert('Funcionalidade de jogar novamente será implementada!');
  };

  const handleAuto = () => {
    // Implementar lógica de auto
    alert('Funcionalidade de auto será implementada!');
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Jogo não encontrado</h1>
          <Link href="/" className="text-green-500 hover:text-green-400">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-black py-4 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://i.postimg.cc/LXKwCgLt/imgi-1-RASPAPIXBR-1.png"
              alt="RASPA PIXBR"
              className="h-8 sm:h-10 md:h-12"
            />
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Saldo */}
              <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-white font-medium">R$ {userBalance.toFixed(2)}</span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Botão Carteira */}
              <button className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </button>
              
              {/* Avatar do Usuário */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    <div className="py-2">
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 border-l-4 border-green-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-white">Conta</span>
                      </button>
                      
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-white">Sacar</span>
                      </button>
                      
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white">Histórico de Jogos</span>
                      </button>
                      
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-white">Transações</span>
                      </button>
                      
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-white">Segurança</span>
                      </button>
                      
                      <div className="border-t border-gray-700 my-2"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginSheet(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => setShowRegisterSheet(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{backgroundColor: '#50c50d'}}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: '#171717' }}
        >
                    {/* Game Info */}
          <div className="px-6 py-4">

            {/* Componente da Raspadinha */}
            <ScratchCard
              gameId={game.id}
              title={game.title}
              price={game.price}
              maxPrize={game.maxPrize}
              isLoggedIn={isLoggedIn}
              isPlaying={isPlaying}
              userBalance={userBalance}
              onLogin={() => setShowLoginSheet(true)}
              onRegister={() => setShowRegisterSheet(true)}
              onBuy={handleBuy}
              onPlayAgain={handlePlayAgain}
              onAuto={handleAuto}
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo e Copyright */}
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="https://i.postimg.cc/LXKwCgLt/imgi-1-RASPAPIXBR-1.png"
                  alt="RASPA PIXBR"
                  className="h-8 sm:h-10 md:h-12"
                />
              </div>
              <p className="text-gray-400 text-sm mb-2">
                © 2025 raspapixbr.com. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-xs">
                Raspadinhas e outros jogos de azar são regulamentados e cobertos pela nossa licença de jogos. Jogue com responsabilidade.
              </p>
            </div>

            {/* Regulamentos */}
            <div>
              <h4 className="text-white font-bold mb-4">Regulamentos</h4>
              <ul className="space-y-2">
                <li><Link href="/jogo-responsavel" className="text-gray-400 hover:text-white text-sm transition-colors">Jogo responsável</Link></li>
                <li><Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h4 className="text-white font-bold mb-4">Ajuda</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">Perguntas Frequentes</Link></li>
                <li><Link href="/como-jogar" className="text-gray-400 hover:text-white text-sm transition-colors">Como Jogar</Link></li>
                <li><Link href="/suporte" className="text-gray-400 hover:text-white text-sm transition-colors">Suporte Técnico</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden">
        <div className="flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Início</span>
          </Link>
          <Link href="/raspadinhas" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Raspadinhas</span>
          </Link>
          <button
            onClick={() => setShowRegisterSheet(true)}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors"
            style={{backgroundColor: '#50c50d'}}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <Link href="/premios" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-xs">Prêmios</span>
          </Link>
          <button
            onClick={() => setShowLoginSheet(true)}
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Entrar</span>
          </button>
        </div>
      </nav>

      {/* Login Bottom Sheet */}
      {showLoginSheet && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowLoginSheet(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#191919] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle superior */}
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">Bem vindo de volta!</h2>
            <p className="text-gray-400 mb-6">Conecte-se para acompanhar seus prêmios, depósitos e muito mais.</p>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@site.com"
                    className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Digite sua senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Insira sua senha..."
                    className="w-full pl-10 pr-20 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-400 text-sm"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                style={{backgroundColor: isLoading ? '#3a8f09' : '#50c50d'}}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'ENTRAR'
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">OU</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            {/* Link para registro */}
            <div className="text-center">
              <p className="text-white mb-2">Ainda não tem uma conta?</p>
              <button
                onClick={() => {
                  setShowLoginSheet(false);
                  setShowRegisterSheet(true);
                }}
                className="font-medium"
                style={{color: '#50c50d'}}
              >
                Registrar
              </button>
            </div>

            {/* Botão Google */}
            <button className="w-full bg-white text-gray-900 font-medium py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Fazer Login com o Google
            </button>
          </div>
        </div>
      )}

      {/* Register Bottom Sheet */}
      {showRegisterSheet && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowRegisterSheet(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#191919] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle superior */}
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">Crie sua conta!</h2>
            <p className="text-gray-400 mb-6">Registre-se para começar a jogar e ganhar prêmios incríveis.</p>

            {/* Formulário */}
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Nome */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nome completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@site.com"
                    className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha forte"
                    className="w-full pl-10 pr-20 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-400 text-sm"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirmar senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-20 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-400 text-sm"
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {/* Botão Registrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                style={{backgroundColor: isLoading ? '#3a8f09' : '#50c50d'}}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  'REGISTRAR'
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">OU</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            {/* Link para login */}
            <div className="text-center">
              <p className="text-white mb-2">Já tem uma conta?</p>
              <button
                onClick={() => {
                  setShowRegisterSheet(false);
                  setShowLoginSheet(true);
                }}
                className="font-medium"
                style={{color: '#50c50d'}}
              >
                Fazer Login
              </button>
            </div>

            {/* Botão Google */}
            <button className="w-full bg-white text-gray-900 font-medium py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Registrar com o Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 