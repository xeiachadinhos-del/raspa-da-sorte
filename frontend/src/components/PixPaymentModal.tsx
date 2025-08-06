'use client';

import { useState, useEffect, useRef } from 'react';

// Configurações do Nomadfy
const NOMADFY_CONFIG = {
  apiKey: 'nd-key.01987cf7-adb3-7559-97b4-abbaee94a20c.3BLOsdwhSnjqtAsFk5vd4FR9qqCw46SYLnEnOTTYm4LGASyQ19mGpWHxCNfaJtNkAenSa15NQBkvydmO2cNNl7EFgV0Wt4LWP2phE27npQnwHSwxAefz',
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
  
  // PROTEÇÕES MUITO FORTES - ESTADOS DE BLOQUEIO
  const [modalLocked, setModalLocked] = useState(false);
  const [hasStartedProcess, setHasStartedProcess] = useState(false);
  const [forceKeepOpen, setForceKeepOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(true); // SEMPRE VISÍVEL
  const modalRef = useRef<HTMLDivElement>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${info}`;
    console.log(debugMessage);
    setDebugInfo(prev => [...prev, debugMessage]);
  };

  // BLOQUEAR FECHAMENTO DO MODAL
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (modalLocked || hasStartedProcess || error)) {
        e.preventDefault();
        addDebugInfo('ESCAPE BLOQUEADO - Modal não pode ser fechado');
        return false;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (modalLocked || hasStartedProcess || error) {
          e.preventDefault();
          addDebugInfo('CLIQUE FORA BLOQUEADO - Modal não pode ser fechado');
          return false;
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalLocked, hasStartedProcess, error]);

  // Criar cobrança PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && amount && user) {
      addDebugInfo('=== MODAL ABERTO - INICIANDO PROCESSO ===');
      setModalLocked(true);
      setHasStartedProcess(true);
      setForceKeepOpen(true);
      setError(null);
      setDebugInfo([]);
      createPixCharge();
    }
  }, [isOpen, amount, user]);

  const createPixCharge = async () => {
    addDebugInfo('=== INÍCIO DA FUNÇÃO createPixCharge ===');
    
    setLoading(true);
    setError(null);
    setModalLocked(true);
    setForceKeepOpen(true);
    
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
      setPaymentStatus(data.status);
      
      addDebugInfo('=== SUCESSO - PIX GERADO ===');
    } catch (err: any) {
      addDebugInfo('=== ERRO DETALHADO ===');
      addDebugInfo(`Mensagem de erro: ${err?.message || 'Erro desconhecido'}`);
      addDebugInfo(`Erro completo: ${JSON.stringify(err, null, 2)}`);
      
      const errorMessage = err?.message || 'Erro desconhecido ao gerar PIX';
      setError(`❌ Erro ao gerar cobrança PIX: ${errorMessage}`);
      
      // MANTER MODAL ABERTO EM CASO DE ERRO
      setModalLocked(true);
      setForceKeepOpen(true);
      addDebugInfo('Modal BLOQUEADO devido ao erro');
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

  // MÚLTIPLAS PROTEÇÕES PARA NÃO FECHAR
  const shouldRender = isOpen || modalLocked || hasStartedProcess || forceKeepOpen || error || loading;
  
  addDebugInfo(`=== VERIFICAÇÃO DE RENDERIZAÇÃO ===`);
  addDebugInfo(`isOpen: ${isOpen}`);
  addDebugInfo(`modalLocked: ${modalLocked}`);
  addDebugInfo(`hasStartedProcess: ${hasStartedProcess}`);
  addDebugInfo(`forceKeepOpen: ${forceKeepOpen}`);
  addDebugInfo(`error: ${error}`);
  addDebugInfo(`loading: ${loading}`);
  addDebugInfo(`shouldRender: ${shouldRender}`);
  
  if (!shouldRender) {
    addDebugInfo('Modal NÃO deve ser renderizado');
    return null;
  }
  
  addDebugInfo('Modal SERÁ renderizado');

  const handleClose = () => {
    addDebugInfo('Tentativa de fechar modal...');
    
    // Só permite fechar se não houver processo em andamento
    if (!loading && !error && !modalLocked) {
      addDebugInfo('Modal pode ser fechado');
      setModalLocked(false);
      setHasStartedProcess(false);
      setForceKeepOpen(false);
      onClose();
    } else {
      addDebugInfo('Modal NÃO pode ser fechado - bloqueado');
      addDebugInfo(`loading: ${loading}, error: ${error}, modalLocked: ${modalLocked}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-[#191919] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Depositar</h2>
          <button
            onClick={handleClose}
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
                    addDebugInfo('Fechando modal após erro');
                    setModalLocked(false);
                    setHasStartedProcess(false);
                    setForceKeepOpen(false);
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

          {/* Debug Info - SEMPRE VISÍVEL */}
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300 max-h-32 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold">Debug Info:</p>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-blue-400 hover:text-blue-300"
              >
                {showDebug ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {showDebug && debugInfo.slice(-8).map((info, index) => (
              <div key={index} className="text-gray-400 mb-1">{info}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 