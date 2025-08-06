'use client';

import { useState, useEffect } from 'react';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  user: any;
  onPaymentSuccess: () => void;
}

interface PaymentData {
  id: string;
  amount: string;
  status: string;
  payment: {
    details: {
      pixQrCode: string;
      pixCode: string;
    };
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
  const [forceOpen, setForceOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Criar cobrança PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && amount && user) {
      console.log('Modal aberto, aguardando novo gateway...');
      // TODO: Implementar novo gateway aqui
    }
  }, [isOpen, amount, user]);

  const createPixCharge = async () => {
    console.log('=== INÍCIO DA FUNÇÃO createPixCharge (NOVO GATEWAY) ===');
    
    setLoading(true);
    setError(null);
    setForceOpen(true);
    setHasError(false);
    
    try {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      console.log('Criando cobrança para valor:', numericAmount);
      
      // Verificar se temos dados do usuário
      if (!user || !user.id || !user.email) {
        throw new Error('Dados do usuário incompletos');
      }
      
      // TODO: Implementar chamada para novo gateway
      console.log('Aguardando configuração do novo gateway...');
      
      // Simular erro por enquanto
      throw new Error('Novo gateway ainda não configurado');
      
    } catch (err: any) {
      console.error('=== ERRO DETALHADO ===');
      console.error('Mensagem de erro:', err?.message || 'Erro desconhecido');
      console.error('Erro completo:', err);
      
      const errorMessage = err?.message || 'Erro desconhecido ao gerar PIX';
      setError(`❌ Erro ao gerar cobrança PIX: ${errorMessage}`);
      setHasError(true);
      
      console.log('Erro definido, NÃO fechando modal!');
      console.log('Modal deve permanecer aberto para debug');
      console.log('hasError:', true);
      console.log('forceOpen:', true);
    } finally {
      setLoading(false);
      console.log('=== FIM DA FUNÇÃO createPixCharge ===');
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

  // MÚLTIPLAS PROTEÇÕES PARA NÃO FECHAR
  const shouldRender = isOpen || forceOpen || hasError || error;
  
  console.log('=== VERIFICAÇÃO DE RENDERIZAÇÃO ===');
  console.log('isOpen:', isOpen);
  console.log('forceOpen:', forceOpen);
  console.log('hasError:', hasError);
  console.log('error:', error);
  console.log('shouldRender:', shouldRender);
  
  if (!shouldRender) {
    console.log('Modal NÃO deve ser renderizado');
    return null;
  }
  
  console.log('Modal SERÁ renderizado');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#191919] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Depositar</h2>
          <button
            onClick={() => {
              console.log('Botão X clicado - fechando modal');
              setForceOpen(false);
              setHasError(false);
              setError(null);
              onClose();
            }}
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

          {/* Error - SEMPRE VISÍVEL SE HOUVER ERRO */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 font-medium">Erro no Pagamento</p>
              </div>
              <p className="text-red-300 text-sm">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={createPixCharge}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  🔄 Tentar Novamente
                </button>
                <button
                  onClick={() => {
                    console.log('Botão Fechar clicado - fechando modal');
                    setForceOpen(false);
                    setHasError(false);
                    setError(null);
                    onClose();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  ❌ Fechar
                </button>
              </div>
            </div>
          )}

          {/* QR Code */}
          {paymentData?.payment?.details?.pixQrCode && !loading && !error && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData.payment.details.pixQrCode)}`}
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
              {paymentData.payment?.details?.pixCode && (
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded px-3 py-2">
                    <input
                      type="text"
                      value={paymentData.payment.details.pixCode}
                      readOnly
                      className="w-full bg-transparent text-white text-sm border-none outline-none"
                    />
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentData.payment.details.pixCode || '')}
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
              <p className="text-yellow-500 text-sm font-medium">
                Status: {paymentStatus}
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


        </div>
      </div>
    </div>
  );
} 