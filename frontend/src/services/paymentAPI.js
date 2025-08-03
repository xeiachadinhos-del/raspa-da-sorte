const API_KEY = 'nd-key.01986eef-4879-70bd-bb28-5a1231656124.r4GFRBZi0Wbwx6Rv1xb1rlWswIT4iz7thBpZ03QP63GhGu1KobZ0muMIsI4D2nnYSZMJO2pihF4PX0zRcb5ka0GFnA3YJHhZGHtfKrR9nrdY0ul3Roao';
const PAYMENT_API_URL = 'https://api.asaas.com/v3'; // URL do gateway de pagamento

class PaymentAPI {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = PAYMENT_API_URL;
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
      const payload = {
        customer: {
          name: userData.name || 'Usuário',
          cpfCnpj: userData.cpfCnpj || '00000000000',
          email: userData.email,
          phone: userData.phone || '(11) 99999-9999',
          accountId: userData.id || 'user-' + Date.now()
        },
        payment: {
          method: 'PIX',
          amount: amount.toString(),
          message: `Depósito Raspa da Sorte - R$ ${amount}`,
          installments: 1
        },
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vencimento em 24h
        callbackUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/payment/webhook`,
        items: [
          {
            name: 'Depósito Raspa da Sorte',
            unitPrice: amount.toString(),
            quantity: 1,
            externalRef: `deposit-${userData.id}-${Date.now()}`
          }
        ],
        metadata: {
          userId: userData.id,
          type: 'deposit',
          game: 'raspa-da-sorte'
        }
      };

      const response = await fetch(`${this.baseURL}/charges`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na API:', errorData);
        throw new Error(`Erro na API: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      return data;
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