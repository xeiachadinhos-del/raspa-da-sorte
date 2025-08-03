'use client';

import { useState } from 'react';

interface ScratchCardProps {
  gameId: string;
  title: string;
  price: string;
  maxPrize: string;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onBuy: () => void;
}

export default function ScratchCard({
  gameId,
  title,
  price,
  maxPrize,
  isLoggedIn,
  onLogin,
  onRegister,
  onBuy
}: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false);

  return (
    <div className="relative">
      {/* Carrossel AO VIVO */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold">
            <span className="text-gray-400">AO</span>
            <span className="text-green-500 ml-1">VIVO</span>
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-slow" style={{ width: 'max-content' }}>
            {[
              { name: 'Josué Ma***', prize: 'Gucci Slide', amount: '1.500,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_sandalha_gucci.png' },
              { name: 'Gilberto Br**', prize: 'Fogão de 5 b', amount: '4.800,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_fogao_5_bocas.png' },
              { name: 'Clarice Va*****', prize: 'Perfume 212 VIP', amount: '399,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_perfume_212.png' },
              { name: 'Danilo Ar***', prize: '1 Real', amount: '1,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png' }
            ].map((winner, index) => (
              <div key={index} className="flex items-center gap-3 py-2 px-4 mr-6 rounded-lg border border-gray-600">
                <img src={winner.image} className="w-8 h-8 object-contain" alt={winner.prize} />
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-amber-400/95">{winner.name}</span>
                  <span className="text-gray-400">{winner.prize}</span>
                  <span className="font-semibold text-emerald-300">R$ {winner.amount}</span>
                </div>
              </div>
            ))}
            
            {/* Duplicação para loop infinito */}
            {[
              { name: 'Josué Ma***', prize: 'Gucci Slide', amount: '1.500,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_sandalha_gucci.png' },
              { name: 'Gilberto Br**', prize: 'Fogão de 5 b', amount: '4.800,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_fogao_5_bocas.png' },
              { name: 'Clarice Va*****', prize: 'Perfume 212 VIP', amount: '399,00', image: 'https://ik.imagekit.io/azx3nlpdu/item_perfume_212.png' },
              { name: 'Danilo Ar***', prize: '1 Real', amount: '1,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png' }
            ].map((winner, index) => (
              <div key={`duplicate-${index}`} className="flex items-center gap-3 py-2 px-4 mr-6 rounded-lg border border-gray-600">
                <img src={winner.image} className="w-8 h-8 object-contain" alt={winner.prize} />
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-amber-400/95">{winner.name}</span>
                  <span className="text-gray-400">{winner.prize}</span>
                  <span className="font-semibold text-emerald-300">R$ {winner.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área da Raspadinha */}
      <div className="relative bg-gray-800 rounded-2xl p-6 min-h-[400px]">
        {/* Estrelas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 text-white/20 text-lg">⭐</div>
          <div className="absolute top-8 right-8 text-white/20 text-lg">⭐</div>
          <div className="absolute top-16 left-12 text-white/20 text-lg">⭐</div>
          <div className="absolute top-20 right-16 text-white/20 text-lg">⭐</div>
          <div className="absolute bottom-16 left-8 text-white/20 text-lg">⭐</div>
          <div className="absolute bottom-8 right-12 text-white/20 text-lg">⭐</div>
        </div>

        {/* Instrução superior */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span>⚡</span>
            <span>Clique em "comprar e raspar" para iniciar o jogo</span>
          </div>
        </div>

        {/* Grid da Raspadinha */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-600 rounded-lg border border-gray-500"
            />
          ))}
        </div>

        {/* Overlay de Login (quando não logado) */}
        {!isLoggedIn && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Faça login pra jogar</h2>
              <p className="text-gray-400 mb-6">Entre ou registre-se para começar a jogar</p>
              <button
                onClick={onRegister}
                className="px-8 py-3 rounded-lg font-medium transition-colors"
                style={{backgroundColor: '#50c50d'}}
              >
                Registrar
              </button>
            </div>
          </div>
        )}

        {/* Interface de Compra (quando logado) */}
        {isLoggedIn && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white mb-4">Comprar por {price}</p>
            <button
              onClick={onBuy}
              className="px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              style={{backgroundColor: '#50c50d'}}
            >
              <span>Comprar</span>
              <div className="bg-green-600 px-2 py-1 rounded text-sm">
                {price}
              </div>
            </button>
          </div>
        )}

        {/* Instruções do jogo */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!
          </p>
          <div className="text-4xl font-bold text-white/10 mt-2">RASPE AQUI!</div>
        </div>
      </div>
    </div>
  );
} 