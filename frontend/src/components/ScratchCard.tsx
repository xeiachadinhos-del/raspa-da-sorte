'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Prize {
  id: string;
  name: string;
  value: number;
  image: string;
  probability: number;
}

interface ScratchCardProps {
  onGameComplete: (won: boolean, prize?: Prize) => void;
  onClose: () => void;
}

const PRIZES: Prize[] = [
  { id: '1', name: 'R$ 0,50', value: 0.50, image: '/images/prizes/prize-1.png', probability: 25 },
  { id: '2', name: 'R$ 1,00', value: 1.00, image: '/images/prizes/prize-2.png', probability: 20 },
  { id: '3', name: 'R$ 2,50', value: 2.50, image: '/images/prizes/prize-3.png', probability: 15 },
  { id: '4', name: 'R$ 5,00', value: 5.00, image: '/images/prizes/prize-4.png', probability: 10 },
  { id: '5', name: 'R$ 10,00', value: 10.00, image: '/images/prizes/prize-5.png', probability: 5 },
  { id: '6', name: 'R$ 25,00', value: 25.00, image: '/images/prizes/prize-6.png', probability: 2 },
  { id: '7', name: 'R$ 50,00', value: 50.00, image: '/images/prizes/prize-7.png', probability: 1 },
  { id: '8', name: 'R$ 100,00', value: 100.00, image: '/images/prizes/prize-8.png', probability: 0.5 },
];

const ScratchCard: React.FC<ScratchCardProps> = ({ onGameComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedCells, setScratchedCells] = useState<boolean[][]>(
    Array(3).fill(null).map(() => Array(3).fill(false))
  );
  const [gameBoard, setGameBoard] = useState<Prize[][]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);

  // Gerar tabuleiro de jogo com 30% de chance de vitória
  useEffect(() => {
    const generateGameBoard = () => {
      const board: Prize[][] = [];
      const shouldWin = Math.random() < 0.30; // 30% de chance de vitória
      
      if (shouldWin) {
        // Gerar prêmio vencedor
        const winningPrize = selectRandomPrize();
        setWinningPrize(winningPrize);
        
        // Criar tabuleiro com 3 prêmios iguais
        const positions = [
          [0, 0], [0, 1], [0, 2],
          [1, 0], [1, 1], [1, 2],
          [2, 0], [2, 1], [2, 2]
        ];
        
        // Escolher 3 posições aleatórias para o prêmio vencedor
        const winningPositions = [];
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * positions.length);
          winningPositions.push(positions.splice(randomIndex, 1)[0]);
        }
        
        // Criar tabuleiro
        for (let i = 0; i < 3; i++) {
          const row: Prize[] = [];
          for (let j = 0; j < 3; j++) {
            if (winningPositions.some(pos => pos[0] === i && pos[1] === j)) {
              row.push(winningPrize);
            } else {
              row.push(selectRandomPrize());
            }
          }
          board.push(row);
        }
      } else {
        // Criar tabuleiro sem vitória
        for (let i = 0; i < 3; i++) {
          const row: Prize[] = [];
          for (let j = 0; j < 3; j++) {
            row.push(selectRandomPrize());
          }
          board.push(row);
        }
      }
      
      setGameBoard(board);
    };

    generateGameBoard();
  }, []);

  const selectRandomPrize = (): Prize => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of PRIZES) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    
    return PRIZES[0]; // Fallback
  };

  const checkWin = (board: Prize[][]): boolean => {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
      if (board[i][0]?.id === board[i][1]?.id && board[i][1]?.id === board[i][2]?.id) {
        return true;
      }
    }
    
    // Verificar colunas
    for (let j = 0; j < 3; j++) {
      if (board[0][j]?.id === board[1][j]?.id && board[1][j]?.id === board[2][j]?.id) {
        return true;
      }
    }
    
    // Verificar diagonais
    if (board[0][0]?.id === board[1][1]?.id && board[1][1]?.id === board[2][2]?.id) {
      return true;
    }
    
    if (board[0][2]?.id === board[1][1]?.id && board[1][1]?.id === board[2][0]?.id) {
      return true;
    }
    
    return false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    handleScratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      handleScratch(e);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    handleScratch(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScratching) {
      e.preventDefault();
      handleScratch(e.touches[0]);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  const handleScratch = (e: MouseEvent | Touch) => {
    if (!canvasRef.current || gameCompleted) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converter coordenadas para células do tabuleiro
    const cellSize = canvas.width / 3;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);

    if (cellX >= 0 && cellX < 3 && cellY >= 0 && cellY < 3) {
      const newScratchedCells = [...scratchedCells];
      newScratchedCells[cellY][cellX] = true;
      setScratchedCells(newScratchedCells);

      // Verificar se todas as células foram raspadas
      const allScratched = newScratchedCells.every(row => row.every(cell => cell));
      
      if (allScratched) {
        setGameCompleted(true);
        const won = checkWin(gameBoard);
        const prize = won ? gameBoard[cellY][cellX] : undefined;
        onGameComplete(won, prize);
      }
    }
  };

  const renderCell = (row: number, col: number) => {
    const isScratched = scratchedCells[row][col];
    const prize = gameBoard[row]?.[col];

    return (
      <div
        key={`${row}-${col}`}
        className={`w-20 h-20 border border-gray-300 flex items-center justify-center ${
          isScratched ? 'bg-white' : 'bg-gray-400'
        }`}
      >
        {isScratched && prize ? (
          <div className="text-center">
            <Image
              src={prize.image}
              alt={prize.name}
              width={40}
              height={40}
              className="mx-auto mb-1"
            />
            <span className="text-xs font-bold text-green-600">
              {prize.name}
            </span>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            <span className="text-gray-600 text-xs">Raspe</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎯 Raspa da Sorte
          </h2>
          <p className="text-gray-600">
            Raspe as células para revelar os prêmios!
          </p>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-1 bg-gray-200 p-2 rounded-lg">
            {Array(3).fill(null).map((_, row) =>
              Array(3).fill(null).map((_, col) => renderCell(row, col))
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Encontre 3 prêmios iguais para ganhar!
          </p>
          
          {gameCompleted && (
            <div className="mb-4">
              {winningPrize ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p className="font-bold">🎉 Parabéns! Você ganhou!</p>
                  <p className="text-lg font-bold">{winningPrize.name}</p>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p className="font-bold">😔 Que pena! Tente novamente!</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {gameCompleted ? 'Fechar' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScratchCard; 