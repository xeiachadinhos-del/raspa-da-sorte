'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MobileNavigationProps {
  isLoggedIn: boolean;
  currentPage?: 'home' | 'raspadinha' | 'depositar' | 'premios' | 'conta';
  onShowDepositSheet?: () => void;
  onShowRegisterSheet?: () => void;
  onShowLoginSheet?: () => void;
  onShowUserMenu?: () => void;
  showUserMenu?: boolean;
}

export default function MobileNavigation({
  isLoggedIn,
  currentPage = 'home',
  onShowDepositSheet,
  onShowRegisterSheet,
  onShowLoginSheet,
  onShowUserMenu,
  showUserMenu = false
}: MobileNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {/* Início */}
        <Link 
          href="/" 
          className={`flex flex-col items-center transition-colors ${
            currentPage === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Início</span>
        </Link>
        
        {/* Raspadinhas */}
        <Link 
          href="/raspadinha" 
          className={`flex flex-col items-center transition-colors ${
            currentPage === 'raspadinha' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs">Raspadinhas</span>
        </Link>
        
        {/* Botão Central - Registrar/Depositar */}
        {isLoggedIn ? (
          <button 
            onClick={onShowDepositSheet}
            className={`flex flex-col items-center ${
              currentPage === 'depositar' ? 'text-white' : ''
            }`}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                currentPage === 'depositar' 
                  ? 'bg-white' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              <svg 
                className={`w-6 h-6 ${
                  currentPage === 'depositar' ? 'text-black' : 'text-white'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-xs">Depositar</span>
          </button>
        ) : (
          <button 
            onClick={onShowRegisterSheet}
            className={`flex flex-col items-center ${
              currentPage === 'depositar' ? 'text-white' : ''
            }`}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                currentPage === 'depositar' 
                  ? 'bg-white' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              <svg 
                className={`w-6 h-6 ${
                  currentPage === 'depositar' ? 'text-black' : 'text-white'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs">Registrar</span>
          </button>
        )}
        
        {/* Prêmios */}
        <Link 
          href="/" 
          className={`flex flex-col items-center transition-colors ${
            currentPage === 'premios' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span className="text-xs">Prêmios</span>
        </Link>
        
        {/* Entrar/Conta */}
        {isLoggedIn ? (
          <button 
            onClick={onShowUserMenu}
            className={`flex flex-col items-center transition-colors ${
              currentPage === 'conta' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Conta</span>
          </button>
        ) : (
          <button 
            onClick={onShowLoginSheet}
            className={`flex flex-col items-center transition-colors ${
              currentPage === 'conta' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Entrar</span>
          </button>
        )}
      </div>
    </nav>
  );
}
