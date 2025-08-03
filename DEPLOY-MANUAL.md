# 🚀 Deploy Manual - Vercel

## 📋 Passo a Passo para Deploy

### 1. **Acessar o Vercel**
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub

### 2. **Importar Projeto**
- Clique em **"New Project"**
- Selecione o repositório: `xeiachadinhos-del/raspa-da-sorte`
- Clique em **"Import"**

### 3. **Configurar Projeto**
- **Framework Preset**: Next.js (deve ser detectado automaticamente)
- **Root Directory**: `frontend` ⚠️ **IMPORTANTE!**
- **Build Command**: `npm run build` (já configurado)
- **Output Directory**: `.next` (já configurado)

### 4. **Variáveis de Ambiente**
Adicione estas variáveis:
```
NEXT_PUBLIC_API_URL=https://raspa-da-sorte-07vt.onrender.com/api
```

### 5. **Deploy**
- Clique em **"Deploy"**
- Aguarde o build completar (2-3 minutos)

### 6. **Verificar Deploy**
- Após o deploy, você receberá uma URL como: `https://raspa-da-sorte-xxx.vercel.app`
- Teste a aplicação:
  - ✅ Página inicial carrega
  - ✅ Login funciona
  - ✅ Interface do usuário logado aparece
  - ✅ Menu dropdown funciona

## 🔧 Configurações Importantes

### **Root Directory**
⚠️ **CRÍTICO**: Deve ser `frontend`, não a raiz do projeto!

### **Build Command**
```bash
npm run build
```

### **Output Directory**
```bash
.next
```

### **Node.js Version**
- Vercel detecta automaticamente
- Projeto usa Node.js 18+

## 🐛 Troubleshooting

### **Erro: "Build failed"**
- Verifique se o Root Directory está como `frontend`
- Verifique se o `package.json` está no diretório correto
- Verifique se todas as dependências estão instaladas

### **Erro: "API not found"**
- Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada
- Teste a URL do backend: `https://raspa-da-sorte-07vt.onrender.com/api/health`

### **Erro: "Module not found"**
- Verifique se o `package.json` está no diretório `frontend`
- Verifique se todas as dependências estão listadas

## 📱 Teste Final

### **Desktop**
- [ ] Header com logo
- [ ] Banner principal
- [ ] Carrossel "AO VIVO"
- [ ] Seção "Destaques"
- [ ] Login/Registro funcionando
- [ ] Interface do usuário logado
- [ ] Menu dropdown funcionando

### **Mobile**
- [ ] Layout responsivo
- [ ] Navegação mobile
- [ ] Botão "Depositar" quando logado
- [ ] Botão "Conta" quando logado

## 🎯 URLs Importantes

### **Frontend (Vercel)**
```
https://raspa-da-sorte.vercel.app
```

### **Backend (Render)**
```
https://raspa-da-sorte-07vt.onrender.com
```

### **Usuário de Teste**
- **Email**: `teste@raspa.com`
- **Senha**: `123456`
- **Saldo**: R$ 1.000,00

## 🎉 Pronto!
Após seguir estes passos, seu sistema estará completamente funcional em produção! 