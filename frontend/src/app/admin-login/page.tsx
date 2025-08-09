'use client';

import { useEffect } from 'react';

export default function AdminLoginRedirect() {
  useEffect(() => {
    // Redirecionar para o arquivo HTML estático
    window.location.href = '/admin-login.html';
  }, []);

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
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div>Carregando página de login...</div>
    </div>
  );
}
