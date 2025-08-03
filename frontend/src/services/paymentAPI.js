const API_KEY = 'nd-key.01986eef-4879-70bd-bb28-5a1231656124.r4GFRBZi0Wbwx6Rv1xb1rlWswIT4iz7thBpZ03QP63GhGu1KobZ0muMIsI4D2nnYSZMJO2pihF4PX0zRcb5ka0GFnA3YJHhZGHtfKrR9nrdY0ul3Roao';
const PAYMENT_API_URL = 'https://api.nomadfy.app/v1'; // URL correta da API Nomadfy

// Teste de conectividade com a API
const testAPIConnection = async () => {
  try {
    console.log('Testando conectividade com:', `${PAYMENT_API_URL}/charges?page=1&size=1`);
    console.log('API Key:', API_KEY.substring(0, 20) + '...');
    
    const response = await fetch(`${PAYMENT_API_URL}/charges?page=1&size=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      }
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Erro no teste de conectividade:', error);
    return false;
  }
};

class PaymentAPI {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = PAYMENT_API_URL;
  }

  // Testar conectividade com a API
  async testConnection() {
    return await testAPIConnection();
  }

  // Headers padrão para todas as requisições
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  // Criar cobrança PIX
  async createPixCharge(userData, amount) {
    try {
      console.log('Iniciando criação de cobrança PIX:', { userData, amount });
      
      // Determinar URL do callback baseada no ambiente
      const isDevelopment = process.env.NODE_ENV === 'development';
      const callbackUrl = isDevelopment 
        ? 'http://localhost:3001/api/payment/webhook'
        : 'https://raspa-da-sorte-backend.onrender.com/api/payment/webhook';
      
      console.log('Ambiente:', process.env.NODE_ENV);
      console.log('Callback URL:', callbackUrl);
      
      // Estrutura simplificada baseada na documentação da API Nomadfy
      const payload = {
        payment: {
          method: 'PIX',
          amount: amount.toString(),
          message: `Depósito Raspa da Sorte - R$ ${amount}`,
          card: {},
          installments: 1
        },
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vencimento em 24h
        customer: {
          name: userData.name || 'Usuário',
          cpfCnpj: userData.cpfCnpj || '00000000000',
          email: userData.email,
          phone: userData.phone || '(11) 99999-9999',
          accountId: userData.id || 'user-' + Date.now()
        },
        callbackUrl: callbackUrl,
        items: [
          {}
        ],
        metadata: {}
      };

      console.log('Payload enviado:', payload);
      console.log('URL da requisição:', `${this.baseURL}/charges`);
      console.log('Headers:', this.getHeaders());
      console.log('Deploy version:', new Date().toISOString());

      try {
        const response = await fetch(`${this.baseURL}/charges`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na API - Status:', response.status);
          console.error('Erro na API - Texto:', errorText);
          
          let errorData = {};
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Erro ao fazer parse do JSON:', e);
          }
          
          throw new Error(`Erro na API: ${response.status} - ${errorData.message || errorData.error || errorText || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);
        return data;
      } catch (fetchError) {
        console.error('Erro na requisição fetch:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Erro ao criar cobrança PIX:', error);
      throw error;
    }
  }

  // Consultar status do pagamento
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/charges/${paymentId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na API:', errorData);
        throw new Error(`Erro na API: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      throw error;
    }
  }

  // Gerar QR Code PIX (se a API retornar os dados do PIX)
  async generatePixQRCode(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/charges/${paymentId}/pixQrCode`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na API:', errorData);
        throw new Error(`Erro na API: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao gerar QR Code PIX:', error);
      throw error;
    }
  }
}

export default new PaymentAPI(); 