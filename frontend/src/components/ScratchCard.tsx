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

      {/* Seção de Prêmios */}
      <div className="mt-8">
        {/* Informação sobre prêmios */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className="text-green-400 font-medium">
                Reúna <span className="text-green-300">3 imagens iguais</span> e conquiste seu prêmio!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                O valor correspondente será creditado automaticamente na sua conta. Se preferir receber o produto físico, basta entrar em contato com o nosso suporte.
              </p>
            </div>
          </div>
        </div>

        {/* Título dos prêmios */}
        <h3 className="text-white font-bold text-lg mb-4">Prêmios da Raspadinha:</h3>

        {/* Grid de prêmios */}
        <div className="flex overflow-x-auto gap-2 pb-2 xl:grid xl:grid-cols-8 xl:overflow-x-visible">
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/variant_jbl_boombox_3_black.png?updatedAt=1751634894498" className="size-full p-2 object-contain" alt="Caixa de som JBL Boombox 3" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Caixa de som JBL Boombox 3</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 2.500,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_iphone_12.png?updatedAt=1751634890863" className="size-full p-2 object-contain" alt="iPhone 12" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">iPhone 12</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 2.500,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/1K.png?updatedAt=1752865094958" className="size-full p-2 object-contain" alt="1.000 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">1.000 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 1.000,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_c2_nk109.png?updatedAt=1751634895731" className="size-full p-2 object-contain" alt="Smartphone modelo C2 NK109" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Smartphone modelo C2 NK109</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 800,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/700.png?updatedAt=1752856623225" className="size-full p-2 object-contain" alt="700 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">700 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 700,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_ft_5_branca_e_preta.png?updatedAt=1751634891004" className="size-full p-2 object-contain" alt="Bola de futebol tamanho 5" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Bola de futebol tamanho 5</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 500,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_212_vip_black.png?updatedAt=1751634894437" className="size-full p-2 object-contain" alt="Perfume 212 VIP Black" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Perfume 212 VIP Black</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 399,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_camisa_do_seu_time.png?updatedAt=1751634896240" className="size-full p-2 object-contain" alt="Camisa de time de futebol" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Camisa de time de futebol</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 350,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_fone_de_ouvido_lenovo.png?updatedAt=1751634891006" className="size-full p-2 object-contain" alt="Fone de ouvido Lenovo" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Fone de ouvido Lenovo</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 220,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/200-REAIS.png?updatedAt=1752865094953" className="size-full p-2 object-contain" alt="200 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">200 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 200,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_copo_t_rmico_stanley_preto.png?updatedAt=1751634897660" className="size-full p-2 object-contain" alt="Copo Stanley preto" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Copo Stanley preto</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 165,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/100%20REAIS.png?updatedAt=1752047821876" className="size-full p-2 object-contain" alt="100 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">100 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 100,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/banner/01K0F5KTMSEJBQF1STFZ4BCKXM.png" className="size-full p-2 object-contain" alt="PowerBank" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">PowerBank</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 60,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/50%20REAIS.png?updatedAt=1752047821745" className="size-full p-2 object-contain" alt="50 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">50 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 50,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/item_chinelo_havaianas_top_branco.png?updatedAt=1751634896291" className="size-full p-2 object-contain" alt="Chinelo Havaianas branco" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">Chinelo Havaianas branco</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 35,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/10%20REAIS.png?updatedAt=1752047821681" className="size-full p-2 object-contain" alt="10 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">10 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 10,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/5%20REAIS.png?updatedAt=1752047821734" className="size-full p-2 object-contain" alt="5 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">5 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 5,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/3%20REAIS.png?updatedAt=1752047821897" className="size-full p-2 object-contain" alt="3 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">3 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 3,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/2%20REAIS.png?updatedAt=1752047821644" className="size-full p-2 object-contain" alt="2 Reais" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">2 Reais</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 2,00</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-24 xl:w-auto">
            <div className="flex flex-col border-2 border-gray-600 p-2 rounded-lg bg-gradient-to-t from-green-500/17 from-[0%] to-[35%] to-gray-800 cursor-pointer aspect-square">
              <img src="https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png?updatedAt=1752047821586" className="size-full p-2 object-contain" alt="1 Real" />
              <h3 className="text-xs font-semibold mb-2 overflow-hidden text-ellipsis text-nowrap">1 Real</h3>
              <div className="px-1 py-0.5 bg-white text-black rounded-sm text-xs font-semibold self-start">R$ 1,00</div>
            </div>
          </div>
        </div>
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