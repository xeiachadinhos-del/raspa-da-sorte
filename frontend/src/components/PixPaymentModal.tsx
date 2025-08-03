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
  amount: string;
  dueDate: string;
  status: string;
  accountId: string;
  payment: {
    method: string;
    amount: string;
    message: string;
    status: string;
    details: {
      pixQrCode?: string;
      pixKey?: string;
      pixCode?: string;
    };
  };
  customer: {
    id: string;
    name: string;
    cpfCnpj: string;
    email: string;
    phone: string;
  };
  items: any[];
  createdAt: string;
  callbackUrl?: string;
  metadata?: any;
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

  // Criar cobrança PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && amount && user) {
      console.log('Modal aberto, iniciando criação de cobrança...');
      console.log('isOpen:', isOpen);
      console.log('amount:', amount);
      console.log('user:', user);
      
      // Pequeno delay para garantir que o modal está aberto
      setTimeout(() => {
        console.log('Executando createPixCharge...');
        createPixCharge();
      }, 100);
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
    console.log('=== INÍCIO DA FUNÇÃO createPixCharge ===');
    console.log('Estado inicial - loading:', loading, 'error:', error, 'forceOpen:', forceOpen);
    
    setLoading(true);
    setError(null);
    setForceOpen(true); // Força o modal a permanecer aberto
    
    console.log('Estados atualizados - loading: true, error: null, forceOpen: true');
    
    try {
      // Testar conectividade primeiro
      console.log('=== INÍCIO DO TESTE DE PIX ===');
      console.log('Testando conectividade com a API...');
      const isConnected = await paymentAPI.testConnection();
      console.log('Conectividade:', isConnected);
      
      if (!isConnected) {
        console.log('❌ Conectividade falhou, definindo erro...');
        setError('❌ Erro de conectividade com o gateway de pagamento. Verifique sua conexão.');
        console.log('Erro definido, retornando...');
        return;
      }

      const numericAmount = parseFloat(amount.replace(',', '.'));
      console.log('Criando cobrança para valor:', numericAmount);
      console.log('Dados do usuário:', user);
      
      const response = await paymentAPI.createPixCharge(user, numericAmount);
      console.log('Resposta da cobrança:', response);
      
      setPaymentData(response);
      setPaymentStatus(response.status || 'pending');
      
      // Se o pagamento já foi confirmado
      if (response.status === 'CONFIRMED' || response.status === 'RECEIVED' || response.status === 'PAID' || response.status === 'APPROVED' || response.status === 'SETTLED') {
        console.log('Pagamento confirmado, fechando modal...');
        onPaymentSuccess();
        onClose();
      }
      
      console.log('=== FIM DO TESTE DE PIX ===');
    } catch (err) {
      console.error('=== ERRO DETALHADO ===');
      console.error('Mensagem de erro:', err.message);
      console.error('Stack trace:', err.stack);
      console.error('Erro completo:', err);
      console.error('=== FIM DO ERRO ===');
      
      console.log('Definindo erro no estado...');
      // Manter o modal aberto e mostrar erro detalhado
      setError(`❌ Erro ao gerar cobrança PIX: ${err.message}`);
      
      console.log('Erro definido, NÃO fechando modal!');
      // NÃO fechar o modal em caso de erro - IMPORTANTE!
      // onClose(); // REMOVIDO
    } finally {
      console.log('Finally executado, definindo loading: false');
      setLoading(false);
      console.log('=== FIM DA FUNÇÃO createPixCharge ===');
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData?.id) return;

    try {
      const response = await paymentAPI.getPaymentStatus(paymentData.id);
      setPaymentStatus(response.status);
      
      if (response.status === 'CONFIRMED' || response.status === 'RECEIVED' || response.status === 'PAID' || response.status === 'APPROVED' || response.status === 'SETTLED') {
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
      case 'PAID':
      case 'APPROVED':
      case 'SETTLED':
        return 'text-green-500';
      case 'OVERDUE':
      case 'CANCELLED':
      case 'CANCELED':
      case 'UNPAID':
      case 'EXPIRED':
        return 'text-red-500';
      case 'IDENTIFIED':
      case 'CONTESTED':
        return 'text-orange-500';
      case 'WAITING':
      case 'NEW':
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
      case 'PAID':
        return 'Pagamento Confirmado';
      case 'OVERDUE':
        return 'Vencido';
      case 'CANCELLED':
      case 'CANCELED':
        return 'Cancelado';
      case 'WAITING':
      case 'NEW':
        return 'Aguardando Pagamento';
      case 'IDENTIFIED':
        return 'Pagamento Identificado';
      case 'APPROVED':
        return 'Pagamento Aprovado';
      case 'UNPAID':
        return 'Não Pago';
      case 'REFUNDED':
        return 'Reembolsado';
      case 'CONTESTED':
        return 'Contestado';
      case 'SETTLED':
        return 'Liquidado';
      case 'EXPIRED':
        return 'Expirado';
      default:
        return 'Aguardando Pagamento';
    }
  };

  // Modal deve permanecer aberto se forceOpen for true, mesmo se isOpen for false
  console.log('Verificando renderização do modal - isOpen:', isOpen, 'forceOpen:', forceOpen, 'error:', error);
  
  if (!isOpen && !forceOpen) {
    console.log('Modal não deve ser renderizado');
    return null;
  }
  
  console.log('Modal será renderizado');

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
                  onClick={onClose}
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
                  src={`data:image/png;base64,${paymentData.payment.details.pixQrCode}`}
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
                    onClick={() => copyToClipboard(paymentData.payment.details.pixCode)}
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

          {/* Debug Info (sempre visível para debug) */}
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300">
            <p><strong>🔧 Informações Técnicas:</strong></p>
            <p>Status: {paymentStatus}</p>
            <p>Payment ID: {paymentData?.id || 'N/A'}</p>
            <p>Amount: R$ {amount}</p>
            <p>User ID: {user?.id || 'N/A'}</p>
            <p>User Email: {user?.email || 'N/A'}</p>
            <p>Loading: {loading ? 'Sim' : 'Não'}</p>
            <p>Error: {error ? 'Sim' : 'Não'}</p>
            <p>API URL: {paymentAPI.baseURL}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 