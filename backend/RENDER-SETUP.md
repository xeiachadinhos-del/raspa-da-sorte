# 🚀 Configuração do Render.com

## 📋 Problema Identificado

O backend não está rodando no Render.com devido a problemas de configuração do banco de dados.

## 🔧 Solução

### 1. Acesse o Dashboard do Render

1. **Acesse**: https://dashboard.render.com
2. **Faça login** na sua conta
3. **Vá para o projeto**: `raspa-da-sorte-backend`

### 2. Configure as Variáveis de Ambiente

No dashboard do Render, vá em **Environment** e configure:

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=sua_chave_jwt_super_secreta_para_producao
FRONTEND_URL=https://raspa-da-sorte.vercel.app
```

### 3. Configure o Banco de Dados PostgreSQL

1. **Vá para a aba "Databases"**
2. **Crie um novo banco PostgreSQL**:
   - **Name**: `raspa-da-sorte-db`
   - **Database**: `raspa_da_sorte`
   - **User**: `raspa_da_sorte_user`
   - **Region**: Escolha a mais próxima

3. **Copie a URL de conexão** que será algo como:
   ```
   postgresql://raspa_da_sorte_user:password@host:port/raspa_da_sorte
   ```

4. **Configure a variável**:
   ```bash
   DATABASE_URL=postgresql://raspa_da_sorte_user:password@host:port/raspa_da_sorte
   ```

### 4. Configure o Build Command

No dashboard do Render, configure:

**Build Command**:
```bash
npm install && npx prisma generate && npx prisma db push
```

**Start Command**:
```bash
node index.js
```

### 5. Faça o Deploy

1. **Clique em "Manual Deploy"**
2. **Selecione "Deploy latest commit"**
3. **Aguarde o deploy completar**

### 6. Configure o Banco Após o Deploy

Após o deploy, execute o script de configuração:

```bash
# No terminal do Render ou via SSH
node setup-render.js
```

## 🧪 Teste Após a Configuração

### 1. Teste o Health Check
```bash
curl https://raspa-da-sorte-backend.onrender.com/api/health
```

### 2. Teste o Login
```bash
curl -X POST https://raspa-da-sorte-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@raspa.com","password":"123456"}'
```

### 3. Teste o Registro
```bash
curl -X POST https://raspa-da-sorte-backend.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste2@raspa.com","password":"123456"}'
```

## 📊 Status Esperado

Após a configuração correta:

- ✅ **Health Check**: `{"status":"OK","message":"Servidor funcionando!"}`
- ✅ **Login**: Retorna token JWT e dados do usuário
- ✅ **Registro**: Cria novo usuário e retorna token
- ✅ **Banco de dados**: PostgreSQL funcionando
- ✅ **Usuário de teste**: `teste@raspa.com` / `123456`

## 🆘 Se Ainda Não Funcionar

### Verificar Logs
1. **Vá para a aba "Logs"** no dashboard do Render
2. **Procure por erros** relacionados a:
   - Conexão com banco de dados
   - Variáveis de ambiente
   - Build do projeto

### Problemas Comuns
1. **DATABASE_URL inválida**: Verifique a URL do PostgreSQL
2. **JWT_SECRET não definido**: Configure a variável
3. **Build falhou**: Verifique se todas as dependências estão no package.json
4. **Porta incorreta**: Certifique-se que está usando a porta 10000

## 📞 Suporte

Se ainda houver problemas, verifique:
1. **Logs do Render** para erros específicos
2. **Status do banco PostgreSQL** no dashboard
3. **Variáveis de ambiente** estão todas configuradas
4. **Build e Start commands** estão corretos 