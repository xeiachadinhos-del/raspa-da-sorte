

export default function AdminLogin() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%)',
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
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        position: 'relative'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Painel Administrativo
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Faça login para acessar o dashboard
          </p>
        </div>
        
        <form id="loginForm" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              id="username"
              name="username"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Digite seu email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <div id="errorMessage" style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            display: 'none'
          }}></div>
          
          <button
            type="submit"
            id="loginButton"
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Entrar no Painel
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <strong>Credenciais de Teste:</strong><br />
          Email: admin@gmail.com<br />
          Senha: 123456
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            const loginButton = document.getElementById('loginButton');
            
            // Mostrar loading
            loginButton.textContent = 'Entrando...';
            loginButton.style.opacity = '0.6';
            loginButton.style.cursor = 'not-allowed';
            
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
              errorMessage.textContent = 'Credenciais inválidas';
              errorMessage.style.display = 'block';
              
              // Resetar botão
              loginButton.textContent = 'Entrar no Painel';
              loginButton.style.opacity = '1';
              loginButton.style.cursor = 'pointer';
            }
          });
        `
      }} />
    </div>
  );
} 