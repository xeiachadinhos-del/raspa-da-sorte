// Teste da API do frontend
const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testando conexão com a API...');
    console.log('URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Login funcionando!');
      console.log('Usuário:', data.user.name);
      console.log('Saldo:', data.user.balance);
    } else {
      console.log('❌ Erro no login:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
}

testAPI(); 