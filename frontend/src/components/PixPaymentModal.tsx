'use client';

import { useState, useEffect } from 'react';

// Configurações da MedusaPay
const MEDUSAPAY_CONFIG = {
  publicKey: 'pk_duOO6JDHwX_dG9v1-ZPjPx6BZwWQvk6Nm794LRcYd9O4aiFf',
  secretKey: 'sk_Zw464Zyjoa8JSNXSLXbb9SFjKKY0LbBdqamPCxuWwe68VBg9',
  apiUrl: 'https://api.medusapay.com.br/v1/transactions'
};

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

  // Criar cobrança PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && amount && user) {
      console.log('Modal aberto, iniciando criação de cobrança...');
      createPixCharge();
    }
  }, [isOpen, amount, user]);

  const createPixCharge = async () => {
    console.log('=== INÍCIO DA FUNÇÃO createPixCharge ===');
    
    setLoading(true);
    setError(null);
    
    try {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      console.log('Criando cobrança MedusaPay para valor:', numericAmount);
      
      // Verificar se temos dados do usuário
      if (!user || !user.id || !user.email) {
        throw new Error('Dados do usuário incompletos');
      }
      
      // Criar payload para MedusaPay
      const payload = {
        amount: Math.round(numericAmount * 100), // MedusaPay usa centavos
        paymentMethod: 'pix',
        externalRef: `deposit_${user.id}_${Date.now()}`,
        metadata: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          depositAmount: numericAmount
        }),
        customer: {
          name: user.name || 'Usuário',
          email: user.email,
          phone: user.phone || '11999999999',
          document: {
            type: 'cpf',
            number: user.cpf || '00000000000'
          }
        },
        items: [
          {
            title: `Depósito - ${amount} reais`,
            quantity: 1,
            tangible: false,
            unitPrice: Math.round(numericAmount * 100),
            externalRef: `deposit_item_${Date.now()}`
          }
        ]
      };

      console.log('Payload MedusaPay:', payload);
      
      // Autenticação Basic
      const auth = 'Basic ' + Buffer.from(MEDUSAPAY_CONFIG.publicKey + ':' + MEDUSAPAY_CONFIG.secretKey).toString('base64');
      
      const response = await fetch(MEDUSAPAY_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Resposta da MedusaPay:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da MedusaPay:', errorText);
        throw new Error(`Erro da MedusaPay: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Dados da MedusaPay:', data);
      
      // Verificar se temos os dados necessários
      if (!data.data?.pix?.qrcode) {
        throw new Error('QR Code não foi gerado pela MedusaPay');
      }
      
      // Converter resposta da MedusaPay para formato esperado
      const paymentData = {
        id: data.data.id.toString(),
        amount: (data.data.amount / 100).toFixed(2),
        status: data.data.status,
        payment: {
          details: {
            pixQrCode: data.data.pix.qrcode,
            pixCode: data.data.pix.qrcode
          }
        }
      };
      
      console.log('PaymentData processado:', paymentData);
      
      setPaymentData(paymentData);
      setPaymentStatus(data.data.status);
      
      console.log('=== SUCESSO - PIX GERADO ===');
    } catch (err: any) {
      console.error('=== ERRO DETALHADO ===');
      console.error('Mensagem de erro:', err?.message || 'Erro desconhecido');
      console.error('Erro completo:', err);
      
      const errorMessage = err?.message || 'Erro desconhecido ao gerar PIX';
      setError(`❌ Erro ao gerar cobrança PIX: ${errorMessage}`);
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

  if (!isOpen) {
    return null;
  }

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

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300">
            <p><strong>🔧 Informações Técnicas:</strong></p>
            <p>Status: {paymentStatus}</p>
            <p>Payment ID: {paymentData?.id || 'N/A'}</p>
            <p>Amount: R$ {amount}</p>
            <p>User ID: {user?.id || 'N/A'}</p>
            <p>User Email: {user?.email || 'N/A'}</p>
            <p>Loading: {loading ? 'Sim' : 'Não'}</p>
            <p>Error: {error ? 'Sim' : 'Não'}</p>
            <p>API URL: https://api.medusapay.com.br/v1/transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
} 