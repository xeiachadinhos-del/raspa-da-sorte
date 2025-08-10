'use client';

import { useState, useEffect } from 'react';

// Configurações do Nomadfy
const NOMADFY_CONFIG = {
  apiKey: 'nd-key.01989213-1c51-7328-8c9c-44490628b4de.kSreIixZMjroPdfLRpxo2sonRL5leCAAyxx52J6sbW6uMUtlkEP5N76eUw6n3UCwPkSxiqRjli6uocHDj0Z781tRtEYsdJbo4CD2UigvDUTayjFgcrjw',
  apiUrl: 'https://api.nomadfy.app/v1/charges'
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
      createPixCharge();
    }
  }, [isOpen, amount, user]);

  const createPixCharge = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Converter valor de "100,00" para "100.00" para compatibilidade com Nomadfy
      const numericAmount = parseFloat(amount.replace(',', '.'));
      const formattedAmount = numericAmount.toFixed(2); // Garantir formato "100.00"
      
      // Verificar se temos dados do usuário
      if (!user || !user.id || !user.email) {
        throw new Error('Dados do usuário incompletos');
      }
      
      // Criar payload para Nomadfy
      const payload = {
        customer: {
          name: user.name || 'Usuário',
          email: user.email,
          phone: user.phone || '(11) 99999-9999',
          cpfCnpj: user.cpf || '12345678900',
          accountId: user.id // Campo obrigatório
        },
        payment: {
          method: 'PIX',
          amount: formattedAmount,
          message: `Depósito - R$ ${formattedAmount}`,
          installments: 1
        },
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Campo obrigatório
        callbackUrl: 'https://raspa-da-sore-gray.vercel.app/api/payment-callback',
        items: [ // Campo obrigatório
          {
            name: `Depósito - R$ ${formattedAmount}`,
            unitPrice: formattedAmount,
            quantity: 1,
            externalRef: `deposit_${user.id}_${Date.now()}`
          }
        ],
        metadata: { userId: user.id, userEmail: user.email, depositAmount: numericAmount }
      };

      const response = await fetch(NOMADFY_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOMADFY_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do Nomadfy: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Log para debug - remover depois
      console.log('Resposta completa do Nomadfy:', JSON.stringify(data, null, 2));
      
      // Verificar se temos os dados necessários
      if (data.payment?.details?.qrcode?.payload) {
        // QR Code encontrado no local correto
        console.log('QR Code encontrado:', data.payment.details.qrcode.payload);
      } else {
        // Tentar outros campos possíveis
        const qrCode = data.payment?.details?.pixQrCode || 
                      data.pixQrCode || 
                      data.qrCode || 
                      data.payment?.pixQrCode;
        
        if (!qrCode) {
          console.error('Estrutura da resposta:', data);
          throw new Error(`QR Code não foi gerado pelo Nomadfy. Estrutura da resposta: ${JSON.stringify(data, null, 2)}`);
        }
        
        // Se encontrou em outro campo, usar
        data.payment = data.payment || {};
        data.payment.details = data.payment.details || {};
        data.payment.details.qrcode = data.payment.details.qrcode || {};
        data.payment.details.qrcode.payload = qrCode;
      }
      
      // Buscar o PIX Code também (pode estar em diferentes campos)
      const pixCode = data.payment?.details?.txid || 
                     data.payment?.details?.pixCode || 
                     data.payment?.pixCode || 
                     data.pixCode;
      
      if (!pixCode) {
        // Se não encontrar PIX Code, usar o payload do QR Code como PIX Code
        const qrPayload = data.payment?.details?.qrcode?.payload;
        if (qrPayload) {
          console.log('Usando payload do QR Code como PIX Code:', qrPayload);
        } else {
          console.error('PIX Code não encontrado na resposta:', data);
          throw new Error(`PIX Code não foi gerado pelo Nomadfy`);
        }
      }
      
      // Converter resposta do Nomadfy para formato esperado
      const paymentData = {
        id: data.id,
        amount: data.amount,
        status: data.status,
        payment: {
          details: {
            pixQrCode: data.payment.details.qrcode.payload,
            pixCode: pixCode || data.payment.details.qrcode.payload // Usar payload como fallback
          }
        }
      };
      
      setPaymentData(paymentData);
      setPaymentStatus(data.status);
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro desconhecido ao gerar PIX';
      setError(`❌ Erro ao gerar cobrança PIX: ${errorMessage}`);
    } finally {
      setLoading(false);
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

        {/* Conteúdo do Modal */}
        {loading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white">Gerando cobrança PIX...</p>
          </div>
        )}

        {error && (
          <div className="p-6 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 font-medium">Erro no Pagamento</p>
              </div>
              <p className="text-red-300 text-sm mb-4">{error}</p>
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
          </div>
        )}

        {paymentData && !error && (
          <div className="p-6 space-y-6">
            {/* Sucesso */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cobrança PIX Gerada!</h3>
              <p className="text-gray-300">Copie o código PIX abaixo e cole no app do seu banco</p>
            </div>

            {/* Código PIX */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Código PIX:</label>
              <div className="relative">
                <textarea
                  readOnly
                  value={paymentData.payment.details.pixCode}
                  className="w-full h-24 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm font-mono resize-none"
                />
                <button
                  onClick={() => copyToClipboard(paymentData.payment.details.pixCode)}
                  className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors"
                  title="Copiar código PIX"
                >
                  {copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm text-center">Código PIX copiado!</p>
              )}
            </div>

            {/* Status do Pagamento */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  paymentStatus === 'PAID' ? 'bg-green-500 text-white' :
                  paymentStatus === 'WAITING' ? 'bg-yellow-500 text-black' :
                  'bg-gray-500 text-white'
                }`}>
                  {paymentStatus === 'PAID' ? 'Pago' :
                   paymentStatus === 'WAITING' ? 'Aguardando' :
                   paymentStatus}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <p>Valor: R$ {paymentData.amount}</p>
                <p>ID: {paymentData.id}</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={createPixCharge}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Gerar Nova Cobrança
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 