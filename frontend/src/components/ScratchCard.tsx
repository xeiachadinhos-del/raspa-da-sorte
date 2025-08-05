'use client';

import React, { useState } from 'react';
import { gameAPI } from '@/services/api';

interface ScratchCardProps {
  gameId: string;
  title: string;
  price: string;
  maxPrize: string;
  isLoggedIn: boolean;
  isPlaying: boolean;
  userBalance?: number;
  onLogin: () => void;
  onRegister: () => void;
  onBuy: (gameSessionId: string) => void;
  onPlayAgain: () => void;
  onAuto: () => void;
  onBalanceUpdate: (newBalance: number) => void;
}

export default function ScratchCard({
  gameId,
  title,
  price,
  maxPrize,
  isLoggedIn,
  isPlaying,
  userBalance = 0,
  onLogin,
  onRegister,
  onBuy,
  onPlayAgain,
  onAuto,
  onBalanceUpdate
}: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [winningPrize, setWinningPrize] = useState<string | null>(null);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [scratchCount, setScratchCount] = useState(0);
  
  // Refs para canvas
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isScratchingRef = React.useRef(false);
  const lastPointRef = React.useRef<{x: number, y: number} | null>(null);
  
  // Prêmios que aparecem atrás da raspadinha
  const prizes = [
    { id: 1, name: 'R$ 1,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png?updatedAt=1752047821586' },
    { id: 2, name: 'R$ 2,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/2%20REAIS.png?updatedAt=1752047821644' },
    { id: 3, name: 'R$ 5,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/5%20REAIS.png?updatedAt=1752047821734' },
    { id: 4, name: 'R$ 10,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/10%20REAIS.png?updatedAt=1752047821681' },
    { id: 5, name: 'R$ 50,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/50%20REAIS.png?updatedAt=1752047821745' },
    { id: 6, name: 'R$ 100,00', image: 'https://ik.imagekit.io/azx3nlpdu/Notas/100%20REAIS.png?updatedAt=1752047821876' },
  ];
  
  // Gerar posições dos prêmios (3x3 grid)
  const [prizePositions, setPrizePositions] = useState<Array<{id: number, name: string, image: string}>>([]);

  // Inicializar canvas quando o jogo começa
  React.useEffect(() => {
    if (isPlaying && canvasRef.current) {
      console.log('Inicializando canvas...');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Carregar imagem da raspadinha
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        console.log('Canvas inicializado com imagem da raspadinha');
      };
      img.src = 'https://i.postimg.cc/65kTBtsM/download.png';
    }
  }, [isPlaying, gameCompleted]); // Adicionar gameCompleted como dependência

  // Gerar posições dos prêmios quando o jogo começa
  React.useEffect(() => {
    if (isPlaying && prizePositions.length === 0) {
      console.log('Gerando novos prêmios...');
      const positions = [];
      const shouldWin = Math.random() < 0.30; // 30% de chance de vitória
      
      console.log('Deve ganhar?', shouldWin);
      
      if (shouldWin) {
        // Gerar prêmio vencedor
        const winningPrize = prizes[Math.floor(Math.random() * prizes.length)];
        console.log('Prêmio vencedor:', winningPrize.name);
        
        // Posições para colocar os 3 prêmios iguais
        const winningPositions = [];
        for (let i = 0; i < 3; i++) {
          let position;
          do {
            position = Math.floor(Math.random() * 9);
          } while (winningPositions.includes(position));
          winningPositions.push(position);
        }
        
        console.log('Posições vencedoras:', winningPositions);
        
        // Criar grid com 3 prêmios iguais
        for (let i = 0; i < 9; i++) {
          if (winningPositions.includes(i)) {
            positions.push(winningPrize);
          } else {
            const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
            positions.push(randomPrize);
          }
        }
      } else {
        // Criar grid sem vitória (garantir que não há 3 iguais)
        console.log('Gerando grid sem vitória...');
        const prizeCounts: {[key: string]: number} = {};
        
        for (let i = 0; i < 9; i++) {
          let attempts = 0;
          let randomPrize;
          
          do {
            randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
            attempts++;
            
            // Verificar se adicionar este prêmio criaria 3 iguais
            const tempCount = (prizeCounts[randomPrize.name] || 0) + 1;
            if (tempCount >= 3) {
              randomPrize = null; // Forçar nova tentativa
            }
          } while (randomPrize === null && attempts < 50);
          
          if (randomPrize) {
            positions.push(randomPrize);
            prizeCounts[randomPrize.name] = (prizeCounts[randomPrize.name] || 0) + 1;
          } else {
            // Fallback: usar qualquer prêmio
            const fallbackPrize = prizes[Math.floor(Math.random() * prizes.length)];
            positions.push(fallbackPrize);
          }
        }
        
        console.log('Contagem final (sem vitória):', prizeCounts);
      }
      
      console.log('Prêmios gerados:', positions.map(p => p.name));
      setPrizePositions(positions);
    }
  }, [isPlaying, prizePositions.length, prizes]);



  // Função para raspar no canvas
  const scratchCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (x - rect.left) * (canvas.width / rect.width);
    const canvasY = (y - rect.top) * (canvas.height / rect.height);

    // Verificar se a área já foi raspada
    try {
      const imageData = ctx.getImageData(canvasX - 10, canvasY - 10, 20, 20);
      const pixels = imageData.data;
      let alreadyScratched = true;
      
      // Verificar se há pixels não transparentes na área
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 50) { // Se há pixels não transparentes
          alreadyScratched = false;
          break;
        }
      }
      
      // Se a área já foi raspada, não fazer nada
      if (alreadyScratched) {
        console.log('Área já raspada, ignorando...');
        return;
      }
    } catch (error) {
      console.log('Erro ao verificar área raspada:', error);
    }

    // Criar efeito de raspagem suave
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(canvasX, canvasY);
      ctx.lineWidth = 40; // Linha mais fina durante raspagem
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 35, 0, 2 * Math.PI);
      ctx.fill();
    }

    lastPointRef.current = { x: canvasX, y: canvasY };

    // Contar scratch simples (funciona sempre)
    setScratchCount(prev => {
      const newCount = prev + 1;
      const percentage = Math.min((newCount / 400) * 100, 100); // 400 scratches = 100% (mais difícil)
      setScratchedPercentage(percentage);
      
      console.log('Scratch count:', newCount, 'Porcentagem:', percentage.toFixed(1) + '%');

      if (percentage > 80 && !gameCompleted) {
        console.log('80% raspado - revelando automaticamente...');
        revealAll();
      }
      
      return newCount;
    });
  };

  // Função para lidar com a raspagem
  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying || gameCompleted) return;

    const x = (e as any).clientX || (e as any).touches?.[0]?.clientX || 0;
    const y = (e as any).clientY || (e as any).touches?.[0]?.clientY || 0;
    
    scratchCanvas(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPlaying || gameCompleted) return;
    e.preventDefault();
    isScratchingRef.current = true;
    lastPointRef.current = null;
    handleScratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPlaying || gameCompleted || !isScratchingRef.current) return;
    e.preventDefault();
    handleScratch(e);
  };

  const handleMouseUp = () => {
    console.log('Mouse up - scratchedPercentage:', scratchedPercentage);
    isScratchingRef.current = false;
    lastPointRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPlaying || gameCompleted) return;
    e.preventDefault();
    isScratchingRef.current = true;
    lastPointRef.current = null;
    handleScratch(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPlaying || gameCompleted || !isScratchingRef.current) return;
    e.preventDefault();
    handleScratch(e);
  };

  const handleTouchEnd = () => {
    console.log('Touch end - scratchedPercentage:', scratchedPercentage);
    isScratchingRef.current = false;
    lastPointRef.current = null;
  };

  // Função para verificar vitória
  const checkWin = () => {
    console.log('Verificando vitória com prêmios:', prizePositions.map(p => p.name));
    
    const prizeCounts: {[key: string]: number} = {};
    prizePositions.forEach(prize => {
      prizeCounts[prize.name] = (prizeCounts[prize.name] || 0) + 1;
    });
    
    console.log('Contagem de prêmios:', prizeCounts);
    
    const winningPrize = Object.entries(prizeCounts).find(([name, count]) => count >= 3);
    if (winningPrize) {
      console.log('VITÓRIA! Prêmio:', winningPrize[0]);
      setWinningPrize(winningPrize[0]);
      
      // Adicionar saldo baseado no prêmio ganho
      const prizeValue = parseFloat(winningPrize[0].replace('R$ ', '').replace('.', '').replace(',', '.'));
      const newBalance = userBalance + prizeValue;
      console.log('Adicionando saldo:', prizeValue, 'Novo saldo:', newBalance);
      onBalanceUpdate(newBalance);
      
      return true;
    }
    
    console.log('DERROTA - Nenhum prêmio com 3 ou mais');
    setWinningPrize(null);
    return false;
  };

  // Função para revelar toda a raspadinha
  const revealAll = () => {
    console.log('=== FUNÇÃO REVEAL ALL CHAMADA ===');
    
    // Revelar completamente a raspadinha
    setScratchedPercentage(100);
    setScratchCount(100);
    
    // Limpar o canvas IMEDIATAMENTE
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        console.log('Limpando canvas...');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    // Marcar como completado para mostrar a raspadinha revelada
    setGameCompleted(true);
    
    // Aguardar 2 segundos APÓS a revelação completa
    setTimeout(() => {
      console.log('Verificando vitória após 2 segundos...');
      const won = checkWin();
      console.log('Resultado da verificação:', won ? 'VITÓRIA' : 'DERROTA');
      
      // Mostrar modal após 2 segundos
      setShowResultModal(true);
    }, 2000); // 2 segundos de delay
  };

  // Função para resetar o jogo e voltar ao estado inicial de compra
  const resetGame = () => {
    console.log('Resetando jogo e voltando ao estado inicial de compra...');
    
    // Resetar o estado do jogo
    setGameCompleted(false);
    setShowResultModal(false);
    setWinningPrize(null);
    setScratchedPercentage(0);
    setScratchCount(0);
    setPrizePositions([]);
    lastPointRef.current = null;
    isScratchingRef.current = false;
    
    // Voltar ao estado inicial de compra (igual primeira vez)
    // Chama onBuy com string vazia para voltar ao estado inicial
    onBuy(''); // Isso deve resetar isPlaying para false
  };

  const handleBuyScratch = async () => {
    console.log('Iniciando compra de raspadinha...');
    
    if (!isLoggedIn) {
      console.log('Usuário não logado, redirecionando para login...');
      onLogin();
      return;
    }

    console.log('Saldo atual:', userBalance, 'Preço:', price);
    setIsLoading(true);
    setError('');

    try {
      // Converter preço de string para número (remover "R$ " e vírgulas)
      const priceValue = parseFloat(price.replace('R$ ', '').replace('.', '').replace(',', '.'));
      console.log('Preço convertido:', priceValue);
      
      if (userBalance < priceValue) {
        console.log('Saldo insuficiente');
        setError('Saldo insuficiente para comprar esta raspadinha');
        setIsLoading(false);
        return;
      }

      console.log('Fazendo requisição para comprar raspadinha...');
      const response = await gameAPI.buyScratch(gameId, priceValue);
      
      if (response.success) {
        console.log('Compra realizada com sucesso!');
        onBalanceUpdate(response.user.balance);
        onBuy(response.gameSession.id);
      } else {
        console.log('Erro na resposta da API:', response);
        setError('Erro ao processar compra');
      }
    } catch (error: any) {
      console.log('Erro ao comprar raspadinha:', error);
      setError(error.message || 'Erro ao comprar raspadinha');
    } finally {
      setIsLoading(false);
    }
  };

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
        {!isPlaying ? (
          <img 
            src="https://i.postimg.cc/65kTBtsM/download.png" 
            alt="Raspadinha" 
            className={`w-full h-auto rounded-lg transition-opacity duration-300 ${
              !isLoggedIn ? 'opacity-40' : 'opacity-60'
            }`}
          />
        ) : (
          <div className="relative w-full">
            {/* Grid de prêmios atrás */}
            <div className="grid grid-cols-3 gap-0 w-full aspect-square rounded-lg overflow-hidden">
              {prizePositions.map((prize, index) => {
                const isWinningPrize = winningPrize && prize.name === winningPrize;
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center bg-gray-800 border ${
                      gameCompleted && isWinningPrize 
                        ? 'border-green-500 bg-green-500/20' 
                        : 'border-gray-600'
                    }`}
                  >
                    <img 
                      src={prize.image} 
                      alt={prize.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs text-white font-bold mt-1">
                      {prize.name}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Canvas para raspagem */}
            {!gameCompleted && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair select-none"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            )}

            {/* Modal de resultado do jogo - apenas dentro da raspadinha */}
            {showResultModal && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                <div className="text-center">
                  {winningPrize ? (
                    <div className="space-y-4">
                      {/* Apenas a imagem do prêmio sem fundo */}
                      <img 
                        src={winningPrize === "R$ 0,50" ? "https://ik.imagekit.io/azx3nlpdu/50-CENTAVOS-2.png?updatedAt=1752864509979" :
                             winningPrize === "R$ 1,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png?updatedAt=1752047821586" :
                             winningPrize === "R$ 2,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/2%20REAIS.png?updatedAt=1752047821644" :
                             winningPrize === "R$ 5,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/5%20REAIS.png?updatedAt=1752047821753" :
                             winningPrize === "R$ 10,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/10%20REAIS.png?updatedAt=1752047821810" :
                             winningPrize === "R$ 50,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/50%20REAIS.png?updatedAt=1752047821864" :
                             winningPrize === "R$ 100,00" ? "https://ik.imagekit.io/azx3nlpdu/Notas/100%20REAIS.png?updatedAt=1752047821921" :
                             "https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png?updatedAt=1752047821586"}
                        alt="prêmio"
                        className="size-24 object-contain mx-auto"
                      />
                      
                      {/* Valor ganho embaixo da imagem */}
                      <p className="text-white text-xl font-bold text-center">
                        {winningPrize}
                      </p>
                      
                      {/* Mensagem de vitória */}
                      <p className="text-white text-lg font-medium text-center">
                        Parabéns! Você ganhou!
                      </p>
                      
                      {/* Botão verde */}
                      <button
                        onClick={resetGame}
                        className="bg-green-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Jogar Novamente</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Mensagem de derrota */}
                      <p className="text-white text-lg font-medium text-center">
                        Que pena! Tente novamente!
                      </p>
                      
                      {/* Botão verde */}
                      <button
                        onClick={resetGame}
                        className="bg-green-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Jogar Novamente</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Botões de Controle - Logo embaixo da raspadinha */}
        {isPlaying && (
          <div className="mt-3">
            {!gameCompleted ? (
              // Botões durante o jogo
              <div className="flex gap-3">
                <button
                  onClick={revealAll}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{backgroundColor: '#50c50d'}}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Revelar Tudo</span>
                </button>
                <button
                  onClick={onAuto}
                  className="px-4 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            ) : null}
          </div>
        )}

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
              {error && (
                <p className="text-red-400 text-sm mb-2">{error}</p>
              )}
              <button
                onClick={handleBuyScratch}
                disabled={isLoading}
                className="px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                style={{backgroundColor: '#50c50d'}}
              >
                {isLoading ? (
                  <span>Comprando...</span>
                ) : (
                  <>
                    <span>Jogar</span>
                    <div className="bg-green-600 px-2 py-1 rounded text-sm">
                      {price}
                    </div>
                  </>
                )}
              </button>
              {userBalance > 0 && (
                <p className="text-gray-300 text-sm mt-2">Saldo: R$ {userBalance.toFixed(2)}</p>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Instruções do jogo */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          Raspe a área para revelar os prêmios, encontre 3 símbolos iguais e ganhe!
        </p>
        {isPlaying && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{Math.round(scratchedPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scratchedPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
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

    </div>
  );
} 