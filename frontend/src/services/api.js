const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

// Autenticação
export const authAPI = {
  // Registrar novo usuário
  register: async (userData) => {
    const response = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Fazer login
  login: async (credentials) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Obter dados do usuário
  getUser: async () => {
    return await apiRequest('/user');
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se está logado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Adicionar saldo ao usuário
  addBalance: async (amount) => {
    return await apiRequest('/user/add-balance', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

// Jogo
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
    return await apiRequest('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify({ credits, amount }),
    });
  },
};

// Histórico
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

// Sistema de Conquistas e Gamificação
export const gamificationAPI = {
  // Login diário
  dailyLogin: async () => {
    return await apiRequest('/daily-login', {
      method: 'POST',
    });
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

// Utilitários
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

// API Administrativa
class AdminAPI {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getStats() {
    const response = await fetch(`${this.baseURL}/api/admin/stats`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.baseURL}/api/admin/users`, {
      method: 'GET',
      headers: this.getHeaders()
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
      body: JSON.stringify({ blocked })
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
      body: JSON.stringify({ winRate })
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
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      throw new Error('Erro ao aprovar saque');
    }

    return response.json();
  }
}

export const adminAPI = new AdminAPI(); 