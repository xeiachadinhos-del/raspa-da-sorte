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
      // Testar conectividade primeiro
      console.log('Testando conectividade com a API...');
      const isConnected = await paymentAPI.testConnection();
      console.log('Conectividade:', isConnected);
      
      if (!isConnected) {
        setError('Erro de conectividade com o gateway de pagamento. Verifique sua conexão.');
        return;
      }

      const numericAmount = parseFloat(amount.replace(',', '.'));
      console.log('Criando cobrança para valor:', numericAmount);
      
      const response = await paymentAPI.createPixCharge(user, numericAmount);
      console.log('Resposta da cobrança:', response);
      
      setPaymentData(response);
      setPaymentStatus(response.status || 'pending');
      
      // Se o pagamento já foi confirmado
      if (response.status === 'CONFIRMED' || response.status === 'RECEIVED' || response.status === 'PAID') {
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(`Erro ao gerar cobrança PIX: ${err.message}`);
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
          <h2 className="text-xl font-semibold text-white">Depositar</h2>
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
          {/* Instruções */}
          <div className="text-center">
            <p className="text-white text-sm">
              Escaneie o QR Code abaixo usando o app do seu banco para realizar o pagamento
            </p>
          </div>

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
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img
                  src={`data:image/png;base64,${paymentData.payment.pixQrCode}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
            </div>
          )}

          {/* Detalhes do Depósito */}
          {paymentData && !loading && !error && (
            <div className="border-2 border-dashed border-white rounded-lg p-4 space-y-3">
              {/* Valor */}
              <div className="flex items-center justify-between">
                <span className="text-green-500 text-xl font-bold">R$ {amount}</span>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Código PIX */}
              {paymentData.payment?.pixCode && (
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded px-3 py-2">
                    <input
                      type="text"
                      value={paymentData.payment.pixCode}
                      readOnly
                      className="w-full bg-transparent text-white text-sm border-none outline-none"
                    />
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentData.payment.pixCode)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors"
                  >
                    {copied ? 'Copiado!' : 'Copiar Código'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Status do Pagamento */}
          {paymentStatus && paymentStatus !== 'pending' && (
            <div className="text-center">
              <p className={`text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                {getStatusText(paymentStatus)}
              </p>
            </div>
          )}

          {/* Aviso de Expiração */}
          {paymentData && !loading && !error && (
            <div className="text-center">
              <p className="text-orange-400 text-sm">
                O QR Code expira em: <span className="font-medium">24 horas</span>
              </p>
            </div>
          )}

          {/* Debug Info (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300">
              <p><strong>Debug Info:</strong></p>
              <p>Status: {paymentStatus}</p>
              <p>Payment ID: {paymentData?.id || 'N/A'}</p>
              <p>Amount: R$ {amount}</p>
              <p>User ID: {user?.id || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 