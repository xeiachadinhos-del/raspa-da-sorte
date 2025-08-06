export default function AdminLogin() {
  return (
    <html>
      <head>
        <title>Login Admin</title>
        <style>{`
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
          }
          
          .login-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            padding: 32px;
            width: 100%;
            max-width: 400px;
          }
          
          .login-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            text-align: center;
            margin-bottom: 32px;
          }
          
          .form-group {
            margin-bottom: 24px;
          }
          
          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
          }
          
          .form-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .login-button {
            width: 100%;
            background-color: #2563eb;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .login-button:hover {
            background-color: #1d4ed8;
          }
          
          .error-message {
            color: #dc2626;
            font-size: 14px;
            text-align: center;
            margin-bottom: 16px;
          }
        `}</style>
      </head>
      <body>
        <div class="login-container">
          <h1 class="login-title">Login Admin</h1>
          
          <form id="loginForm">
            <div class="form-group">
              <label for="username" class="form-label">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-input"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="login-button">
              Entrar
            </button>
          </form>
        </div>
        
        <script>{`
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
        `}</script>
      </body>
    </html>
  );
} 