

export default function AdminLogin() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
            overflow: hidden;
          }
          
          .login-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 40px;
            width: 100%;
            max-width: 450px;
            position: relative;
            z-index: 10000;
          }
          
          .login-title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            text-align: center;
            margin-bottom: 8px;
          }
          
          .login-subtitle {
            font-size: 16px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 32px;
          }
          
          .form-group {
            margin-bottom: 24px;
          }
          
          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
          }
          
          .form-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .login-button {
            width: 100%;
            background-color: #2563eb;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .login-button:hover {
            background-color: #1d4ed8;
          }
          
          .error-message {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            font-size: 14px;
            padding: 12px 16px;
            border-radius: 8px;
            text-align: center;
            display: none;
            margin-bottom: 16px;
          }
          
          .credentials-box {
            text-align: center;
            margin-top: 24px;
            padding: 16px;
            background-color: #f8fafc;
            border-radius: 8px;
            font-size: 14px;
            color: #64748b;
          }
        `
      }} />
      
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
        <div className="login-container">
          <h1 className="login-title">Painel Administrativo</h1>
          <p className="login-subtitle">Faça login para acessar o dashboard</p>
          
          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Email</label>
              <input
                type="email"
                id="username"
                name="username"
                className="form-input"
                placeholder="Digite seu email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            <div id="errorMessage" className="error-message"></div>
            
            <button
              type="submit"
              id="loginButton"
              className="login-button"
            >
              Entrar no Painel
            </button>
          </form>
          
          <div className="credentials-box">
            <strong>Credenciais de Teste:</strong><br />
            Email: admin@gmail.com<br />
            Senha: 123456
          </div>
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
    </>
  );
} 