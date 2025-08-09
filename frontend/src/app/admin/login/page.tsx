

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
            background: #000000;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
            overflow: hidden;
          }
          
          .login-container {
            background: transparent;
            border-radius: 12px;
            padding: 40px;
            width: 100%;
            max-width: 450px;
            position: relative;
            z-index: 10000;
          }
          
          .login-title {
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            text-align: center;
            margin-bottom: 8px;
          }
          
          .login-subtitle {
            font-size: 16px;
            color: #9ca3af;
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
            color: #ffffff;
            margin-bottom: 8px;
          }
          
          .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #50c50d;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
            background: #1f2937;
            color: #ffffff;
          }
          
          .form-input:focus {
            border-color: #50c50d;
            box-shadow: 0 0 0 3px rgba(80, 197, 13, 0.1);
          }
          
          .form-input::placeholder {
            color: #9ca3af;
          }
          
          .password-container {
            position: relative;
          }
          
          .password-toggle {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
          }
          
          .login-button {
            width: 100%;
            background-color: #50c50d;
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
            background-color: #45b00a;
          }
          
          .error-message {
            background-color: #dc2626;
            border: 1px solid #dc2626;
            color: #ffffff;
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
            background-color: #1f2937;
            border-radius: 8px;
            font-size: 14px;
            color: #9ca3af;
            border: 1px solid #374151;
          }
        `
      }} />
      
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
        <div className="login-container">
          <h1 className="login-title">Faça login</h1>
          
          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="username" className="form-label">E-mail*</label>
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
              <label htmlFor="password" className="form-label">Senha*</label>
              <div className="password-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => {
                    const passwordInput = document.getElementById('password') as HTMLInputElement;
                    const toggleButton = document.querySelector('.password-toggle') as HTMLButtonElement;
                    
                    if (passwordInput.type === 'password') {
                      passwordInput.type = 'text';
                      toggleButton.textContent = '🙈';
                    } else {
                      passwordInput.type = 'password';
                      toggleButton.textContent = '👁️';
                    }
                  }}
                >
                  👁️
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '14px'}}>
                <input type="checkbox" style={{width: '16px', height: '16px'}} />
                Lembre de mim
              </label>
            </div>
            
            <div id="errorMessage" className="error-message"></div>
            
            <button
              type="submit"
              id="loginButton"
              className="login-button"
            >
              Login
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
          function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleButton = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              toggleButton.textContent = '🙈';
            } else {
              passwordInput.type = 'password';
              toggleButton.textContent = '👁️';
            }
          }
          
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
              loginButton.textContent = 'Login';
              loginButton.style.opacity = '1';
              loginButton.style.cursor = 'pointer';
            }
          });
        `
      }} />
    </>
  );
} 