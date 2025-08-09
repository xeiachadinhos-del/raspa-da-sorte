'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Verificar credenciais
    if (username === 'admin@gmail.com' && password === '123456') {
      // Salvar token de admin
      localStorage.setItem('adminToken', 'admin-token-123');
      localStorage.setItem('adminUser', JSON.stringify({
        username: 'admin@gmail.com',
        role: 'admin'
      }));
      
      // Redirecionar para o dashboard
      window.location.href = '/admin/dashboard';
    } else {
      setError('Credenciais inválidas');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      zIndex: 9999,
      margin: 0,
      border: 'none'
    }}>
      <div style={{
        background: 'transparent',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        zIndex: 10000
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Faça login
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '8px'
            }}>
              E-mail*
            </label>
            <input
              type="email"
              name="username"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #50c50d',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: '#1f2937',
                color: '#ffffff'
              }}
              placeholder="Digite seu email"
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '8px'
            }}>
              Senha*
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #50c50d',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  background: '#1f2937',
                  color: '#ffffff'
                }}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              fontSize: '14px'
            }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              Lembre de mim
            </label>
          </div>
          
          {error && (
            <div style={{
              backgroundColor: '#dc2626',
              border: '1px solid #dc2626',
              color: '#ffffff',
              fontSize: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#50c50d',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Entrando...' : 'Login'}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#9ca3af',
          border: '1px solid #374151'
        }}>
          <strong>Credenciais de Teste:</strong><br />
          Email: admin@gmail.com<br />
          Senha: 123456
        </div>
      </div>
    </div>
  );
} 
