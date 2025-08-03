// Usando fetch nativo do Node.js

const BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Testando Backend...\n');

  // Teste 1: Health Check
  try {
    console.log('1. Testando Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    console.log('Status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Resposta:', healthData);
    console.log('✅ Health Check OK\n');
  } catch (error) {
    console.log('❌ Health Check FALHOU:', error.message, '\n');
  }

  // Teste 2: Login
  try {
    console.log('2. Testando Login...');
    const loginResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'teste@raspa.com',
        password: '123456'
      })
    });
    console.log('Status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Resposta:', loginData);
    console.log('✅ Login OK\n');
  } catch (error) {
    console.log('❌ Login FALHOU:', error.message, '\n');
  }

  // Teste 3: Registro
  try {
    console.log('3. Testando Registro...');
    const registerResponse = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Teste Usuário',
        email: 'teste2@raspa.com',
        password: '123456'
      })
    });
    console.log('Status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Resposta:', registerData);
    console.log('✅ Registro OK\n');
  } catch (error) {
    console.log('❌ Registro FALHOU:', error.message, '\n');
  }
}

testBackend(); 