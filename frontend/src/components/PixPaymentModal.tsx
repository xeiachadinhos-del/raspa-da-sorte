'use client';

import { useState, useEffect } from 'react';
import paymentAPI from '../services/paymentAPI';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  user: any;
  onPaymentSuccess: () => void;
}

interface PaymentData {
  id: string;
  status: string;
  payment: {
    pixQrCode?: string;
    pixKey?: string;
    pixCode?: string;
  };
}

export default function PixPaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  user, 
  onPaymentSuccess 
}: PixPaymentModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  // Criar cobrança PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && amount && user) {
      createPixCharge();
    }
  }, [isOpen, amount, user]);

  // Polling para verificar status do pagamento
  useEffect(() => {
    if (paymentData?.id && paymentStatus === 'pending') {
      const interval = setInterval(checkPaymentStatus, 5000); // Verificar a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [paymentData?.id, paymentStatus]);

  const createPixCharge = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      const response = await paymentAPI.createPixCharge(user, numericAmount);
      
      setPaymentData(response);
      setPaymentStatus(response.status);
      
      // Se o pagamento já foi confirmado
      if (response.status === 'CONFIRMED' || response.status === 'RECEIVED') {
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      setError('Erro ao gerar cobrança PIX. Tente novamente.');
      console.error('Erro ao criar cobrança:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData?.id) return;

    try {
      const response = await paymentAPI.getPaymentStatus(paymentData.id);
      setPaymentStatus(response.status);
      
      if (response.status === 'CONFIRMED' || response.status === 'RECEIVED') {
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
        return 'text-green-500';
      case 'OVERDUE':
      case 'CANCELLED':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
        return 'Pagamento Confirmado';
      case 'OVERDUE':
        return 'Vencido';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return 'Aguardando Pagamento';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#191919] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Pagamento PIX</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Valor */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">Valor a pagar</p>
            <p className="text-2xl font-bold text-white">R$ {amount}</p>
          </div>

          {/* Status */}
          {paymentStatus && (
            <div className="text-center">
              <p className={`text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                {getStatusText(paymentStatus)}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Gerando cobrança PIX...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={createPixCharge}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* QR Code */}
          {paymentData?.payment?.pixQrCode && !loading && !error && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img
                  src={`data:image/png;base64,${paymentData.payment.pixQrCode}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Escaneie o QR Code com seu app bancário
              </p>
            </div>
          )}

          {/* Código PIX */}
          {paymentData?.payment?.pixCode && !loading && !error && (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Código PIX:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={paymentData.payment.pixCode}
                  readOnly
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(paymentData.payment.pixCode)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Chave PIX */}
          {paymentData?.payment?.pixKey && !loading && !error && (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Chave PIX:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={paymentData.payment.pixKey}
                  readOnly
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(paymentData.payment.pixKey)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Instruções */}
          {paymentData && !loading && !error && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-400 text-sm font-medium mb-2">Como pagar:</p>
              <ol className="text-blue-300 text-sm space-y-1">
                <li>1. Abra seu app bancário</li>
                <li>2. Escolha a opção PIX</li>
                <li>3. Escaneie o QR Code ou cole o código PIX</li>
                <li>4. Confirme o pagamento</li>
                <li>5. Aguarde a confirmação automática</li>
              </ol>
            </div>
          )}

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 