# 🚨 DEPLOY URGENTE - Resolver Erro de Login

## ⚠️ PROBLEMA IDENTIFICADO
O frontend está tentando acessar rotas que não existem:
- ❌ `/api/auth/login` (não existe)
- ❌ `/api/auth/register` (não existe)

**Rotas corretas no backend:**
- ✅ `/api/login` (funcionando)
- ✅ `/api/register` (funcionando)

## 🔧 SOLUÇÃO IMEDIATA

### 1. **Acessar o Vercel**
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub

### 2. **Verificar Projeto Existente**
- Procure por um projeto chamado `raspa-da-sorte`
- Se existir, clique nele
- Se não existir, continue para o passo 3

### 3. **Criar Novo Projeto**
- Clique em **"New Project"**
- Selecione o repositório: `xeiachadinhos-del/raspa-da-sorte`
- Clique em **"Import"**

### 4. **Configuração CRÍTICA**
- **Framework Preset**: Next.js
- **Root Directory**: `frontend` ⚠️ **OBRIGATÓRIO!**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 5. **Variáveis de Ambiente**
Adicione esta variável:
```
NEXT_PUBLIC_API_URL=https://raspa-da-sorte-07vt.onrender.com/api
```

### 6. **Deploy**
- Clique em **"Deploy"**
- Aguarde 2-3 minutos

## 🧪 TESTE APÓS DEPLOY

### **1. Testar Backend (já funciona)**
```bash
curl -X POST https://raspa-da-sorte-07vt.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@raspa.com","password":"123456"}'
```

### **2. Testar Frontend**
- Acesse a URL do Vercel (ex: `https://raspa-da-sorte-xxx.vercel.app`)
- Tente fazer login com:
  - Email: `teste@raspa.com`
  - Senha: `123456`

## 🔍 VERIFICAÇÃO

### **Se o erro persistir:**
1. **Limpe o cache do navegador** (Ctrl+F5)
2. **Teste em modo incógnito**
3. **Verifique o console do navegador** (F12)

### **Logs esperados no console:**
- ✅ `POST /api/login` (não `/api/auth/login`)
- ✅ `POST /api/register` (não `/api/auth/register`)

## 🎯 CÓDIGO CORRETO

O frontend já está usando o código correto:
```typescript
// ✅ CORRETO - usa o serviço de API
const response = await authAPI.login({ email, password });

// ❌ INCORRETO - não existe mais
const response = await fetch('/api/auth/login', ...);
```

## 📞 SUPORTE

Se ainda houver problemas:
1. Verifique se o Root Directory está como `frontend`
2. Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada
3. Aguarde 5 minutos após o deploy
4. Teste em navegador diferente

## 🎉 RESULTADO ESPERADO

Após o deploy correto:
- ✅ Login funciona
- ✅ Registro funciona
- ✅ Interface do usuário logado aparece
- ✅ Menu dropdown funciona
- ✅ Sistema de saldo funciona

**🚨 IMPORTANTE: O problema é apenas no deploy, o código está correto!** 