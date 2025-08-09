'use client';

import { useState, useEffect, useRef } from 'react';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  bonus?: number;
  onWithdraw?: () => void;
}

export default function BalanceModal({ isOpen, onClose, balance, bonus = 0, onWithdraw }: BalanceModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  const totalBalance = balance + bonus;

  return (
    <div 
      ref={tooltipRef}
      className={`absolute z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        top: '100%',
        right: '0',
        marginTop: '4px',
        minWidth: '220px',
        maxWidth: '270px'
      }}
    >
      {/* Conteúdo do balão compacto */}
      <div className="bg-gray-800 rounded-md border border-gray-600 p-3 shadow-md">
        {/* Saldo e Bônus */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-green-400">R$ {balance.toFixed(2).replace('.', ',')}</span>
            <span className="text-white text-sm">Saldo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">R$ {bonus.toFixed(2).replace('.', ',')}</span>
            <span className="text-white text-sm">Bônus</span>
          </div>
        </div>
        
        {/* Separador */}
        <div className="border-t border-gray-600 my-2"></div>
        
        {/* Total */}
        <div className="flex flex-col mb-2">
          <div className="flex justify-between">
            <span className="text-gray-300 font-medium text-sm">Total</span>
            <span className="font-semibold text-lg text-green-400">
              R$ {totalBalance.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            O saldo total é a soma do seu saldo e bônus.
          </p>
        </div>
        
        {/* Botão Sacar */}
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium text-sm h-8 rounded-md flex items-center justify-center gap-1.5 px-3 transition-colors"
          onClick={() => {
            onClose();
            onWithdraw?.();
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" className="w-4 h-4">
            <path d="M22 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM7 20v-2a2 2 0 0 1 2 2Zm10 0h-2a2 2 0 0 1 2-2Zm0-4a4 4 0 0 0-4 4h-2a4 4 0 0 0-4-4V8h10Zm4-6h-2V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3H3V4h18Zm-9 5a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"></path>
          </svg>
          Sacar
        </button>
      </div>
    </div>
  );
}
