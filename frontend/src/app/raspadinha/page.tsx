'use client';

import { useState, useEffect } from 'react';
import ScratchCard from '@/components/ScratchCard';
import MobileNavigation from '@/components/MobileNavigation';

export default function RaspadinhaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDepositSheet, setShowDepositSheet] = useState(false);
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#171717] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="bg-[#262626] px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Saldo:</span>
              <span className="ml-2 text-white font-bold">R$ 0,00</span>
            </div>
          </div>
          <button className="bg-[#50c50d] text-white px-4 py-2 rounded-lg text-sm font-medium">
            Jogar
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="px-4 py-6 pb-24">
        {/* AO VIVO indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#4ec50d'}}></div>
          <h2 className="text-xl font-bold">
            <span className="text-gray-400">AO</span>
            <span className="ml-1" style={{color: '#4ec50d'}}>VIVO</span>
          </h2>
        </div>

        {/* Área da Raspadinha */}
        <div className="bg-[#191919] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Raspadinha da Sorte</h3>
          <p className="text-gray-400 text-sm text-center mb-6">
            Escolha uma raspadinha e teste sua sorte!
          </p>
          
          {/* Aqui você pode adicionar o componente ScratchCard ou outras opções */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Componente da raspadinha será implementado aqui
            </p>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-[#191919] rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Como Jogar</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Escolha o valor da sua raspadinha</li>
            <li>• Raspe a área indicada para revelar o prêmio</li>
            <li>• Ganhos são creditados automaticamente na sua conta</li>
            <li>• Jogue com responsabilidade</li>
          </ul>
        </div>
      </main>

      {/* Navegação Mobile */}
      <MobileNavigation 
        isLoggedIn={isLoggedIn}
        currentPage="raspadinha"
        onShowDepositSheet={() => setShowDepositSheet(true)}
        onShowRegisterSheet={() => setShowRegisterSheet(true)}
        onShowLoginSheet={() => setShowLoginSheet(true)}
        onShowUserMenu={() => setShowUserMenu(!showUserMenu)}
        showUserMenu={showUserMenu}
      />
    </div>
  );
}
