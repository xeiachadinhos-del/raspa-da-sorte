export default function AdminLogin() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Login Admin
        </h1>
        
        <form id="loginForm" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
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
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <div id="errorMessage" style={{
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center',
            display: 'none'
          }}></div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </form>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
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
            }
          });
        `
      }} />
    </div>
  );
} 