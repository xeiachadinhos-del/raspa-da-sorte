'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authAPI } from '../../../services/api';

// Configurações do Nomadfy
const NOMADFY_CONFIG = {
  apiKey: 'nd-key.01987cf7-adb3-7559-97b4-abbaee94a20c.3BLOsdwhSnjqtAsFk5vd4FR9qqCw46SYLnEnOTTYm4LGASyQ19mGpWHxCNfaJtNkAenSa15NQBkvydmO2cNNl7EFgV0Wt4LWP2phE27npQnwHSwxAefz',
  apiUrl: 'https://api.nomadfy.app/v1/charges'
};

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

export default function PixPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const amount = params.amount as string;
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${info}`;
    console.log(debugMessage);
    setDebugInfo(prev => [...prev, debugMessage]);
  };

  // Verificar usuário logado
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      addDebugInfo('Usuário não logado, redirecionando...');
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    addDebugInfo(`Usuário logado: ${currentUser.email}`);
    createPixCharge();
  }, [router]);

  const createPixCharge = async () => {
    addDebugInfo('=== INÍCIO DA FUNÇÃO createPixCharge ===');
    
    setLoading(true);
    setError(null);
    
    try {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      addDebugInfo(`Criando cobrança para valor: ${numericAmount}`);
      
      // Verificar se temos dados do usuário
      if (!user || !user.id || !user.email) {
        throw new Error('Dados do usuário incompletos');
      }
      
      addDebugInfo(`Usuário: ${user.email} (ID: ${user.id})`);
      
      // Criar payload para Nomadfy
      const payload = {
        customer: {
          name: user.name || 'Usuário',
          cpfCnpj: user.cpf || '00000000000',
          email: user.email,
          phone: user.phone || '(11) 99999-9999',
          accountId: user.id
        },
        payment: {
          method: 'PIX',
          amount: amount,
          message: `Depósito - ${amount} reais`,
          installments: 1
        },
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24 horas
        callbackUrl: 'https://raspa-da-sorte-gray.vercel.app/api/payment-callback',
        items: [
          {
            name: `Depósito - ${amount} reais`,
            unitPrice: amount,
            quantity: 1,
            externalRef: `deposit_${user.id}_${Date.now()}`
          }
        ],
        metadata: {
          userId: user.id,
          userEmail: user.email,
          depositAmount: numericAmount
        }
      };

      addDebugInfo('Payload criado, fazendo requisição...');
      addDebugInfo(`URL: ${NOMADFY_CONFIG.apiUrl}`);
      addDebugInfo(`API Key: ${NOMADFY_CONFIG.apiKey.substring(0, 20)}...`);
      
      const response = await fetch(NOMADFY_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOMADFY_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      addDebugInfo(`Resposta recebida: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addDebugInfo(`ERRO HTTP: ${response.status} - ${errorText}`);
        throw new Error(`Erro do Nomadfy: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      addDebugInfo('Dados recebidos com sucesso');
      addDebugInfo(`Dados: ${JSON.stringify(data, null, 2)}`);
      
      // Verificar se temos os dados necessários
      if (!data.payment?.details?.pixQrCode) {
        addDebugInfo('ERRO: QR Code não encontrado na resposta');
        throw new Error('QR Code não foi gerado pelo Nomadfy');
      }
      
      // Converter resposta do Nomadfy para formato esperado
      const paymentData = {
        id: data.id,
        amount: data.amount,
        status: data.status,
        payment: {
          details: {
            pixQrCode: data.payment.details.pixQrCode,
            pixCode: data.payment.details.pixCode || data.payment.details.pixQrCode
          }
        }
      };
      
      addDebugInfo('PaymentData processado com sucesso');
      
      setPaymentData(paymentData);
      
      addDebugInfo('=== SUCESSO - PIX GERADO ===');
    } catch (err: any) {
      addDebugInfo('=== ERRO DETALHADO ===');
      addDebugInfo(`Mensagem de erro: ${err?.message || 'Erro desconhecido'}`);
      addDebugInfo(`Erro completo: ${JSON.stringify(err, null, 2)}`);
      
      const errorMessage = err?.message || 'Erro desconhecido ao gerar PIX';
      setError(`❌ Erro ao gerar cobrança PIX: ${errorMessage}`);
    } finally {
      setLoading(false);
      addDebugInfo('=== FIM DA FUNÇÃO createPixCharge ===');
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

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    setError(null);
    setPaymentData(null);
    setLoading(true);
    createPixCharge();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pagamento PIX</h1>
          <p className="text-gray-600">Valor: R$ {amount}</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Gerando cobrança PIX...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">Erro no Pagamento</p>
            </div>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                🔄 Tentar Novamente
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}

        {/* QR Code */}
        {paymentData?.payment?.details?.pixQrCode && !loading && !error && (
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentData.payment.details.pixQrCode)}`}
                alt="QR Code PIX"
                className="w-64 h-64"
              />
            </div>
          </div>
        )}

        {/* Código PIX */}
        {paymentData?.payment?.details?.pixCode && !loading && !error && (
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código PIX:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentData.payment.details.pixCode}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(paymentData.payment.details.pixCode || '')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        {paymentData && !loading && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Como pagar:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Abra o app do seu banco</li>
              <li>2. Escaneie o QR Code ou cole o código PIX</li>
              <li>3. Confirme o pagamento</li>
              <li>4. Aguarde a confirmação</li>
            </ol>
          </div>
        )}

        {/* Botão Voltar */}
        <div className="text-center">
          <button
            onClick={handleBackToHome}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            🏠 Voltar ao Início
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
          <p className="font-bold mb-2">Debug Info:</p>
          {debugInfo.slice(-6).map((info, index) => (
            <div key={index} className="text-gray-500 mb-1">{info}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 