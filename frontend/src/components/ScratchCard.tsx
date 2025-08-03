'use client';

import { useState } from 'react';

interface ScratchCardProps {
  gameId: string;
  title: string;
  price: string;
  maxPrize: string;
  isLoggedIn: boolean;
  isPlaying: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onBuy: () => void;
  onPlayAgain: () => void;
  onAuto: () => void;
}

export default function ScratchCard({
  gameId,
  title,
  price,
  maxPrize,
  isLoggedIn,
  isPlaying,
  onLogin,
  onRegister,
  onBuy,
  onPlayAgain,
  onAuto
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
      <div className="relative w-full max-w-md mx-auto">
        <img 
          src="https://i.postimg.cc/65kTBtsM/download.png" 
          alt="Raspadinha" 
          className={`w-full h-auto rounded-lg transition-opacity duration-300 ${
            !isLoggedIn ? 'opacity-40' : isPlaying ? 'opacity-100' : 'opacity-60'
          }`}
        />

        {/* Overlay de Login (quando não logado) */}
        {!isLoggedIn && (
          <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center">
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

        {/* Interface de Compra (quando logado mas não jogando) */}
        {isLoggedIn && !isPlaying && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-white mb-4 text-lg font-semibold">Comprar por {price}</p>
              <button
                onClick={onBuy}
                className="px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                style={{backgroundColor: '#50c50d'}}
              >
                <span>Jogar</span>
                <div className="bg-green-600 px-2 py-1 rounded text-sm">
                  {price}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instruções do jogo */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          Raspe os 9 quadradinhos, encontre 3 símbolos iguais e ganhe o prêmio!
        </p>
      </div>

      {/* Botões de Controle (quando jogando) */}
      {isPlaying && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{backgroundColor: '#50c50d'}}
          >
            Jogar Novamente
          </button>
          <button
            onClick={onAuto}
            className="px-4 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onAuto}
            className="px-4 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-white text-sm">Auto</span>
          </button>
        </div>
      )}
    </div>
  );
} 