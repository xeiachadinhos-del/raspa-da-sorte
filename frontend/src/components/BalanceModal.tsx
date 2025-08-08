'use client';

import { useState, useEffect } from 'react';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  bonus?: number;
}

export default function BalanceModal({ isOpen, onClose, balance, bonus = 0 }: BalanceModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const totalBalance = balance + bonus;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        {/* Header com ícone */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Saldo da Conta</h2>
        </div>

        {/* Card de saldo */}
        <div className="bg-gray-700 rounded-xl p-4 mb-6">
          {/* Saldo */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-green-400 font-semibold text-lg">
              R$ {balance.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-white font-medium">Saldo</span>
          </div>

          {/* Bônus */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-green-400 font-semibold text-lg">
              R$ {bonus.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-white font-medium">Bônus</span>
          </div>

          {/* Linha separadora */}
          <div className="border-t border-gray-600 my-3"></div>

          {/* Total */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-medium">Total</span>
            <span className="text-green-400 font-bold text-xl">
              R$ {totalBalance.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Descrição */}
          <p className="text-gray-300 text-sm">
            O saldo total é a soma do seu saldo e bônus.
          </p>
        </div>

        {/* Botão Sacar */}
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Sacar
        </button>

        {/* Botão fechar */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
