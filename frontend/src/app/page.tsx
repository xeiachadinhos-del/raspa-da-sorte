'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import PixPaymentModal from '../components/PixPaymentModal';
import AdminPanel from '../components/AdminPanel';

export default function Home() {
  const router = useRouter();
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [showDepositSheet, setShowDepositSheet] = useState(false);
  const [showPixPaymentModal, setShowPixPaymentModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('0,00');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{id: string; name: string; email: string; balance: number; credits: number} | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Verificar se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Função para atualizar valor do depósito
  const handleDepositAmountChange = (amount: string) => {
    setDepositAmount(amount);
  };

  // Função para lidar com sucesso do pagamento PIX
  const handlePaymentSuccess = async () => {
    try {
      // Atualizar saldo do usuário no backend
      const numericAmount = parseFloat(depositAmount.replace(',', '.'));
      await authAPI.addBalance(numericAmount);
      
      // Atualizar estado local
      if (user) {
        const updatedUser = { ...user, balance: user.balance + numericAmount };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Fechar modais
      setShowDepositSheet(false);
      setShowPixPaymentModal(false);
      
      // Resetar valor
      setDepositAmount('0,00');
      
      alert('Depósito realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      alert('Erro ao atualizar saldo. Entre em contato com o suporte.');
    }
  };

  // Função de logout
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  // Função de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      
      // Atualizar estado
      setIsLoggedIn(true);
      setUser(response.user);
      
      // Fechar aba e limpar campos
      setShowLoginSheet(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de cadastro
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
      
      // Atualizar estado
      setIsLoggedIn(true);
      setUser(response.user);
      
      // Fechar aba e limpar campos
      setShowRegisterSheet(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dados dos ganhadores ao vivo
  const liveWinners = [
    { name: 'Maurício Ma***', prize: 'Volkswagen Nivus', amount: '120.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/banner/01K0BEAQVG9N3GAAJDCKAY5ECP.png' },
    { name: 'Jácomo Pe***', prize: 'Apple Watch Ultra 2', amount: '9.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/variant_apple_watch_ultra_2_pulseira_loop_alpina_azul_p.png?updatedAt=1751634892598' },
    { name: 'Maicon Ma*****', prize: '200 Reais', amount: '200,00', image: 'https://ik.imagekit.io/azx3nlpdu/200-REAIS.png?updatedAt=1752865094953' },
    { name: 'James Sa***', prize: 'Copo Stanley azul', amount: '165,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_copo_termico_stanley_azul.png?updatedAt=1751634891016' },
    { name: 'Ítalo So***', prize: 'Controle Xb', amount: '700,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_controle_xbox_astral_purple.png?updatedAt=1751634897414' },
    { name: 'Ivana Gu****', prize: '5 Reais', amount: '5,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/5%20REAIS.png?updatedAt=1752047821734' },
    { name: 'Demian Ar****', prize: 'Micro-ondas', amount: '1.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_micro_ondas_flat.png?updatedAt=1751634890350' },
    { name: 'Vitor Du****', prize: '3 Reais', amount: '3,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/3%20REAIS.png?updatedAt=1752047821897' },
    { name: 'Murilo Ce*******', prize: 'Churrasqueira a gás GS Performance', amount: '5.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_churrasqueira_a_g_s_performance_340s.png?updatedAt=1751634896209' },
    { name: 'Michelle Ta****', prize: 'Air Fryer', amount: '850,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_air_fryer.png?updatedAt=1751634894630' },
    { name: 'Abgail Co*****', prize: 'Apple AirPods 3ª geração', amount: '1.900,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_airpods_3_gera_o.png?updatedAt=1751634894740' },
    { name: 'Mariah Te***', prize: '1000 Reais', amount: '1.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/1K.png?updatedAt=1752865094958' },
    { name: 'Andréa Ba*****', prize: 'Cabo USB tipo C para recarga', amount: '360,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_cabo_para_recarga_usb_c.png?updatedAt=1751634895696' },
    { name: 'Malena Ra*****', prize: 'Galaxy Z Flip5', amount: '6.000,00', image: 'https://ik.imagekit.io/azx3nlpdu/variant_galaxy_z_flip5_256_gb_creme.png?updatedAt=1751634892797' },
  ];

  // Dados dos jogos em destaque
  const featuredGames = [
    {
      id: 'raspadinha-1',
      title: 'Raspadinha 1',
      banner: 'RASPADINHA 1',
      maxPrize: 'R$ 100,00',
      price: 'R$ 0,50',
      icon: 'https://i.postimg.cc/FFW5mz44/imgi-74-troco-premiado.png'
    },
    {
      id: 'raspadinha-2',
      title: 'Raspadinha 2',
      banner: 'RASPADINHA 2',
      maxPrize: 'R$ 200,00',
      price: 'R$ 1,00',
      icon: 'https://i.postimg.cc/X7rMvWjy/imgi-75-Tech-Mania.png'
    },
    {
      id: 'raspadinha-3',
      title: 'Raspadinha 3',
      banner: 'RASPADINHA 3',
      maxPrize: 'R$ 500,00',
      price: 'R$ 2,50',
      icon: 'https://i.postimg.cc/L6wcYW5Q/imgi-76-apple-mania.png'
    },
    {
      id: 'raspadinha-4',
      title: 'Raspadinha 4',
      banner: 'RASPADINHA 4',
      maxPrize: 'R$ 1.000,00',
      price: 'R$ 5,00',
      icon: 'https://i.postimg.cc/3xGPgZD8/imgi-77-beleza-premiada.png'
    },
    {
      id: 'raspadinha-5',
      title: 'Raspadinha 5',
      banner: 'RASPADINHA 5',
      maxPrize: 'R$ 2.000,00',
      price: 'R$ 10,00',
      icon: 'https://i.postimg.cc/FFW5mz44/imgi-74-troco-premiado.png'
    },
    {
      id: 'raspadinha-6',
      title: 'Raspadinha 6',
      banner: 'RASPADINHA 6',
      maxPrize: 'R$ 5.000,00',
      price: 'R$ 25,00',
      icon: 'https://i.postimg.cc/X7rMvWjy/imgi-75-Tech-Mania.png'
    }
  ];



    return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-black px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/LXKwCgLt/imgi-1-RASPAPIXBR-1.png" 
            alt="RASPA PIXBR" 
            className="h-8 sm:h-10 md:h-12"
          />
        </div>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* Saldo */}
            <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-white font-medium">R$ {user?.balance?.toFixed(2) || '0,00'}</span>
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
                    
                    {/* Opção de Admin - Apenas para admin@gmail.com */}
                    {user?.email === 'admin@gmail.com' && (
                      <>
                        <div className="border-t border-gray-700 my-2"></div>
                        <button 
                          onClick={() => {
                            setShowAdminPanel(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 text-yellow-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Painel Admin</span>
                        </button>
                      </>
                    )}
                    
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
          <div className="flex gap-2">
            <button 
              onClick={() => setShowLoginSheet(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => setShowRegisterSheet(true)}
              className="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
              style={{backgroundColor: '#50c50d'}}
            >
              <span>+</span>
              Registrar
            </button>
          </div>
        )}
      </header>

      {/* Container Principal - Balão Cinza Escuro */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#171717' }}>
            
            {/* Main Banner */}
            <section className="relative px-4">
              <div 
                className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-contain bg-center bg-no-repeat mx-auto"
                style={{
                  backgroundImage: 'url("https://i.postimg.cc/NGWD1v8X/banner-raspapix.png")',
                  borderRadius: '20px'
                }}
              ></div>
            </section>

            {/* Seção AO VIVO */}
            <section className="py-1 px-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold">
                  <span className="text-gray-400">AO</span>
                  <span className="text-green-500 ml-1">VIVO</span>
                </h2>
              </div>

              {/* Carrossel de Ganhadores - Layout Minimalista */}
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll-slow" style={{ width: 'max-content' }}>
                  {liveWinners.map((winner, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 px-4 mr-6 rounded-lg border border-gray-600">
                      <img src={winner.image} className="w-8 h-8 object-contain" alt={winner.prize} />
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-amber-400/95">
                          {winner.name}
                        </span>
                        <span className="text-gray-400">
                          {winner.prize}
                        </span>
                        <span className="font-semibold text-emerald-300">
                          R$ {winner.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Duplicação para loop infinito */}
                  {liveWinners.map((winner, index) => (
                    <div key={`duplicate-${index}`} className="flex items-center gap-3 py-2 px-4 mr-6 rounded-lg border border-gray-600">
                      <img src={winner.image} className="w-8 h-8 object-contain" alt={winner.prize} />
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-amber-400/95">
                          {winner.name}
                        </span>
                        <span className="text-gray-400">
                          {winner.prize}
                        </span>
                        <span className="font-semibold text-emerald-300">
                          R$ {winner.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seção Destaques */}
            <section className="py-8 px-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-bold text-white">Destaques</h3>
                </div>
                <Link href="/jogos" className="text-white hover:text-green-400 transition-colors">
                  Ver mais &gt;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGames.map((game) => (
                  <div key={game.id} className="text-card-foreground flex flex-col relative p-4 shadow-sm max-w-[26.083rem] max-h-[13.604rem] gap-4 select-none rounded-lg transition-all duration-400 group" style={{background: 'transparent', border: '1px solid transparent', borderImage: 'linear-gradient(74.5deg, #4ebf0b, #000000) 1', borderRadius: '12px'}}>
                    
                    {/* Banner do jogo */}
                    <div className="w-full aspect-[5/1] overflow-hidden rounded-lg">
                      <img src={game.icon} alt={game.title} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    
                    {/* Título e prêmio */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2.5">
                      <h1 className="font-semibold text-white">{game.title}</h1>
                      <h2 className="text-xs text-amber-400 font-medium opacity-90 uppercase">PRÊMIOS DE ATÉ {game.maxPrize}</h2>
                    </div>
                    
                    {/* Botões */}
                    <div className="flex items-end sm:items-center justify-between">
                      <Link href={`/jogo/${game.id}`} className="">
                        <button className="active:scale-95 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-white shadow-xs h-10 rounded-md px-4 cursor-pointer" style={{backgroundColor: '#50c50d'}}>
                          <section className="flex gap-2 justify-between items-center">
                            <div className="flex gap-1 items-center font-semibold text-gray-800">
                              <svg fill="currentColor" viewBox="0 0 256 256" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" className="size-5">
                                <path d="M198.51 56.09C186.44 35.4 169.92 24 152 24h-48c-17.92 0-34.44 11.4-46.51 32.09C46.21 75.42 40 101 40 128s6.21 52.58 17.49 71.91C69.56 220.6 86.08 232 104 232h48c17.92 0 34.44-11.4 46.51-32.09C209.79 180.58 216 155 216 128s-6.21-52.58-17.49-71.91Zm1.28 63.91h-32a152.8 152.8 0 0 0-9.68-48h30.59c6.12 13.38 10.16 30 11.09 48Zm-20.6-64h-28.73a83 83 0 0 0-12-16H152c10 0 19.4 6 27.19 16ZM152 216h-13.51a83 83 0 0 0 12-16h28.73C171.4 210 162 216 152 216Zm36.7-32h-30.58a152.8 152.8 0 0 0 9.68-48h32c-.94 18-4.98 34.62-11.1 48Z"></path>
                              </svg>
                              <span className="font-semibold">Jogar</span>
                            </div>
                            <div className="bg-black rounded-md p-1.5 flex items-center gap-1 text-xs">
                              <span className="text-green-400">R$</span> <span className="text-white">{game.price.replace('R$ ', '')}</span>
                            </div>
                          </section>
                        </button>
                      </Link>
                      
                      <Link href={`/jogo/${game.id}#rewards`} className="sm:pt-3 pb-0.5 sm:pb-0 flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-emerald-400 active:text-emerald-400 active:scale-95 transition-all duration-200">
                        <svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" className="group-hover:animate-wiggle size-3">
                          <path d="m190.5 68.8 34.8 59.2H152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32h-41.6c6.1-12 9.6-25.6 9.6-40 0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152c-48.6 0-88 39.4-88 88zm336 0c0 22.1-17.9 40-40 40h-73.3l34.8-59.2c7.6-12.9 21.4-20.8 36.3-20.8h2.2c22.1 0 40 17.9 40 40zM32 288v176c0 26.5 21.5 48 48 48h144V288zm256 224h144c26.5 0 48-21.5 48-48V288H288z"></path>
                        </svg>
                        <span>VER PRÊMIOS</span>
                        <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-3">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 4 8 8-8 8"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>



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

      {/* Navegação Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden">
        <div className="flex justify-around items-center py-2">
          {/* Início */}
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Início</span>
          </Link>
          
          {/* Raspadinhas */}
          <Link href="/raspadinhas" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Raspadinhas</span>
          </Link>
          
          {/* Botão Central - Registrar/Depositar */}
          {isLoggedIn ? (
            <button 
              onClick={() => setShowDepositSheet(true)} 
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#50c50d'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xs text-white">Depositar</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowRegisterSheet(true)} 
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#50c50d'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-white">Registrar</span>
            </button>
          )}
          
          {/* Prêmios */}
          <Link href="/premios" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-xs">Prêmios</span>
          </Link>
          
          {/* Entrar/Conta */}
          {isLoggedIn ? (
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)} 
              className="flex flex-col items-center text-gray-400"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Conta</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginSheet(true)} 
              className="flex flex-col items-center text-gray-400"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Entrar</span>
            </button>
          )}
        </div>
      </nav>

            {/* Aba de Login (Bottom Sheet) */}
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

      {/* Aba de Cadastro (Bottom Sheet) */}
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
            <h2 className="text-2xl font-bold text-white mb-2">Criar conta</h2>
            <p className="text-gray-400 mb-6">Cadastre-se para começar a jogar e ganhar prêmios incríveis.</p>
            
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
              
              {/* Botão Cadastrar */}
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
                    Cadastrando...
                  </>
                ) : (
                  'CADASTRAR'
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
                Entrar
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
              Fazer Cadastro com o Google
            </button>
          </div>
        </div>
      )}

      {/* Modal de Depósito */}
      {showDepositSheet && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowDepositSheet(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#191919] rounded-t-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle superior */}
            <div className="bg-gray-600 mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full"></div>
            
            {/* Header com Banner */}
            <div className="flex flex-col gap-1.5 p-4 text-center">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src="https://i.postimg.cc/6pgMtHtr/imgi-81-deposit-bg.jpg" 
                  className="w-full h-32 object-cover"
                  alt="Deposit Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
              </div>
            </div>
            
            {/* Título */}
            <div className="flex items-center gap-2 px-4 mb-4">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 15v3m0 3v-3m0 0h-3m3 0h3"></path>
                <path fill="currentColor" fillRule="evenodd" d="M5 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h7.083A6 6 0 0 1 12 18c0-1.148.322-2.22.881-3.131A3 3 0 0 1 9 12a3 3 0 1 1 5.869.881A5.97 5.97 0 0 1 18 12c1.537 0 2.939.578 4 1.528V8a3 3 0 0 0-3-3zm7 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" clipRule="evenodd"></path>
              </svg>
              <h1 className="text-2xl font-medium text-white">Depositar</h1>
            </div>
            
            {/* Formulário */}
            <form className="space-y-3 overflow-hidden px-4 pb-6">
              {/* Campo de Valor */}
              <div>
                <label className="flex items-center font-medium select-none mb-2 text-base text-white">
                  Valor:
                </label>
                <div className="relative">
                  <span className="font-semibold opacity-80 absolute left-3 top-2/4 -translate-y-2/4 text-white">R$</span>
                  <input
                    type="tel"
                    value={depositAmount}
                    readOnly
                    className="pl-10 w-full rounded-md border bg-gray-800 px-3.5 py-2.5 text-base text-white border-gray-600"
                  />
                </div>
                <div className="mt-1 text-xs text-rose-600/90">O valor mínimo é R$ 10,00</div>
              </div>
              
              {/* Botões de Valores */}
              <div className="overflow-hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 pt-3">
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('10,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer whitespace-nowrap border transition-colors ${
                      depositAmount === '10,00' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30'
                    }`}
                  >
                    R$ 10,00
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('30,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer relative whitespace-nowrap border transition-colors ${
                      depositAmount === '30,00' 
                        ? 'bg-green-600 text-white border-green-600 ring-2 ring-yellow-400' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30 ring-2 ring-yellow-400'
                    }`}
                  >
                    <span className="bg-yellow-400 rounded-md absolute -top-0.5 left-2/4 -translate-y-2/4 -translate-x-2/4 text-xs text-black leading-4 px-1 uppercase flex gap-1 items-center">
                      <svg width="1em" height="1em" fill="currentColor" className="w-3 h-3" viewBox="0 0 16 16">
                        <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"></path>
                      </svg>
                      QUENTE
                    </span>
                    R$ 30,00
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('50,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer whitespace-nowrap border transition-colors ${
                      depositAmount === '50,00' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30'
                    }`}
                  >
                    R$ 50,00
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('100,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer whitespace-nowrap border transition-colors ${
                      depositAmount === '100,00' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30'
                    }`}
                  >
                    R$ 100,00
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('200,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer whitespace-nowrap border transition-colors ${
                      depositAmount === '200,00' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30'
                    }`}
                  >
                    R$ 200,00
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDepositAmountChange('500,00')}
                    className={`text-base font-semibold rounded-md p-3 py-2 cursor-pointer whitespace-nowrap border transition-colors ${
                      depositAmount === '500,00' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30'
                    }`}
                  >
                    R$ 500,00
                  </button>
                </div>
              </div>
              
                                      {/* Botão Gerar QR Code */}
                        <button 
                          onClick={() => {
                            if (depositAmount === '0,00') {
                              alert('Selecione um valor para depositar');
                              return;
                            }
                            setShowPixPaymentModal(true);
                          }}
                          className="active:scale-95 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-green-600 text-white shadow-xs hover:bg-green-700 h-10 rounded-md px-6 w-full mx-auto mt-4 relative overflow-hidden py-6 cursor-pointer"
                        >
                          <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path fill="currentColor" d="M8 6H6v2h2zm-5-.75A2.25 2.25 0 0 1 5.25 3h3.5A2.25 2.25 0 0 1 11 5.25v3.5A2.25 2.25 0 0 1 8.75 11h-3.5A2.25 2.25 0 0 1 3 8.75zm2.25-.75a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75zM6 16h2v2H6zm-3-.75A2.25 2.25 0 0 1 5.25 13h3.5A2.25 2.25 0 0 1 11 15.25v3.5A2.25 2.25 0 0 1 8.75 21h-3.5A2.25 2.25 0 0 1 3 18.75zm2.25-.75a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75zM18 6h-2v2h2zm-2.75-3A2.25 2.25 0 0 0 13 5.25v3.5A2.25 2.25 0 0 0 15.25 11h3.5A2.25 2.25 0 0 0 21 8.75v-3.5A2.25 2.25 0 0 0 18.75 3zm-.75 2.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75zM13 13h2.75v2.75H13zm5.25 2.75h-2.5v2.5H13V21h2.75v-2.75h2.5V21H21v-2.75h-2.75zm0 0V13H21v2.75z"></path>
                          </svg>
                          Gerar QR Code
                          <span className="bg-black/20 absolute left-0 top-0 bottom-0 w-0"></span>
                        </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pagamento PIX */}
      <PixPaymentModal
        isOpen={showPixPaymentModal}
        onClose={() => setShowPixPaymentModal(false)}
        amount={depositAmount}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Painel Administrativo */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}
