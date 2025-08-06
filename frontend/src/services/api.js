const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Cache para tokens e dados do usuário
const cache = {
  token: null,
  user: null,
  lastFetch: 0
};

// Função para fazer requisições à API com otimizações
async function apiRequest(endpoint, options = {}) {
  const token = cache.token || localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
    // Timeout otimizado
    signal: AbortSignal.timeout(10000), // 10 segundos
  };

  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const endTime = Date.now();
    console.log(`API ${endpoint} - ${endTime - startTime}ms`);
    
    // Verificar se a resposta é JSON válido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON:', contentType);
      const text = await response.text();
      console.error('Conteúdo da resposta:', text);
      throw new Error('Servidor retornou resposta inválida');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    
    // Se for erro de timeout, tentar novamente uma vez
    if (error.name === 'TimeoutError') {
      console.log('Timeout detectado, tentando novamente...');
      try {
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          signal: AbortSignal.timeout(15000), // 15 segundos na segunda tentativa
        });
        
        // Verificar se a resposta é JSON válido
        const retryContentType = retryResponse.headers.get('content-type');
        if (!retryContentType || !retryContentType.includes('application/json')) {
          console.error('Retry: Resposta não é JSON:', retryContentType);
          const retryText = await retryResponse.text();
          console.error('Retry: Conteúdo da resposta:', retryText);
          throw new Error('Servidor retornou resposta inválida');
        }
        
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          throw new Error(retryData.error || 'Erro na requisição');
        }
        
        return retryData;
      } catch (retryError) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
    }
    
    throw error;
  }
}

// Autenticação otimizada
export const authAPI = {
  // Registrar novo usuário
  register: async (userData) => {
    const startTime = Date.now();
    
    const response = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      cache.token = response.token;
      cache.user = response.user;
      cache.lastFetch = Date.now();
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    const endTime = Date.now();
    console.log(`Registro completado em ${endTime - startTime}ms`);
    
    return response;
  },

  // Fazer login otimizado
  login: async (credentials) => {
    const startTime = Date.now();
    
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      cache.token = response.token;
      cache.user = response.user;
      cache.lastFetch = Date.now();
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    const endTime = Date.now();
    console.log(`Login completado em ${endTime - startTime}ms`);
    
    return response;
  },

  // Obter dados do usuário com cache
  getUser: async () => {
    // Usar cache se ainda for válido (menos de 5 minutos)
    const now = Date.now();
    if (cache.user && (now - cache.lastFetch) < 300000) {
      return cache.user;
    }
    
    const user = await apiRequest('/user');
    cache.user = user;
    cache.lastFetch = now;
    
    return user;
  },

  // Fazer logout
  logout: () => {
    cache.token = null;
    cache.user = null;
    cache.lastFetch = 0;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se está logado (otimizado)
  isAuthenticated: () => {
    return !!(cache.token || localStorage.getItem('token'));
  },

  // Obter usuário atual (otimizado)
  getCurrentUser: () => {
    if (cache.user) {
      return cache.user;
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      cache.user = JSON.parse(user);
      return cache.user;
    }
    
    return null;
  },

  // Adicionar saldo ao usuário
  addBalance: async (amount) => {
    const response = await apiRequest('/user/add-balance', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    
    // Atualizar cache do usuário
    if (cache.user) {
      cache.user.balance = (cache.user.balance || 0) + amount;
      localStorage.setItem('user', JSON.stringify(cache.user));
    }
    
    return response;
  },
};

// Jogo otimizado
export const gameAPI = {
  // Comprar raspadinha
  buyScratch: async (gameId, price) => {
    return await apiRequest('/games/buy-scratch', {
      method: 'POST',
      body: JSON.stringify({ gameId, price }),
    });
  },

  // Revelar raspadinha
  revealScratch: async (gameSessionId) => {
    return await apiRequest('/games/reveal-scratch', {
      method: 'POST',
      body: JSON.stringify({ gameSessionId }),
    });
  },

  // Obter histórico de jogos
  getGameHistory: async () => {
    return await apiRequest('/games/history');
  },

  // Comprar créditos
  purchaseCredits: async (credits, amount) => {
    const response = await apiRequest('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify({ credits, amount }),
    });
    
    // Atualizar cache do usuário
    if (cache.user) {
      cache.user.credits = (cache.user.credits || 0) + credits;
      localStorage.setItem('user', JSON.stringify(cache.user));
    }
    
    return response;
  },
};

// Histórico otimizado
export const historyAPI = {
  // Obter prêmios
  getPrizes: async () => {
    return await apiRequest('/prizes');
  },

  // Obter transações
  getTransactions: async () => {
    return await apiRequest('/transactions');
  },
};

// Sistema de Conquistas e Gamificação otimizado
export const gamificationAPI = {
  // Login diário
  dailyLogin: async () => {
    const response = await apiRequest('/daily-login', {
      method: 'POST',
    });
    
    // Atualizar cache do usuário
    if (cache.user && response.user) {
      cache.user = response.user;
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Obter conquistas
  getAchievements: async () => {
    return await apiRequest('/achievements');
  },

  // Obter estatísticas do usuário
  getUserStats: async () => {
    return await apiRequest('/user/stats');
  },
};

// Utilitários otimizados
export const utils = {
  // Formatar moeda
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  // Formatar data
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  },
};

// API Administrativa otimizada
class AdminAPI {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  getHeaders() {
    const token = cache.token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getStats() {
    const response = await fetch(`${this.baseURL}/api/admin/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.baseURL}/api/admin/users`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }

    return response.json();
  }

  async blockUser(userId, blocked) {
    const response = await fetch(`${this.baseURL}/api/admin/users/${userId}/block`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ blocked }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error('Erro ao bloquear usuário');
    }

    return response.json();
  }

  async updateWinRate(winRate) {
    const response = await fetch(`${this.baseURL}/api/admin/settings/win-rate`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ winRate }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar taxa de vitória');
    }

    return response.json();
  }

  async approvePayout(userId, amount) {
    const response = await fetch(`${this.baseURL}/api/admin/payouts/${userId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error('Erro ao aprovar saque');
    }

    return response.json();
  }
}

export const adminAPI = new AdminAPI(); 