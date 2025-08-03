# 🗄️ Configuração do Banco PostgreSQL

## Opção 1: Supabase (Gratuito)
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Configure:
   - Name: `raspa-da-sorte`
   - Database Password: `123456`
   - Region: (escolha a mais próxima)
6. Clique em "Create new project"
7. Aguarde criar (2-3 minutos)
8. Vá em "Settings" → "Database"
9. Copie a "Connection string"
10. Use no Render como DATABASE_URL

## Opção 2: Neon (Gratuito)
1. Acesse: https://neon.tech
2. Clique em "Sign Up"
3. Faça login com GitHub
4. Clique em "Create Project"
5. Configure:
   - Project Name: `raspa-da-sorte`
   - Region: (escolha a mais próxima)
6. Clique em "Create Project"
7. Copie a "Connection string"
8. Use no Render como DATABASE_URL

## Opção 3: Render PostgreSQL
1. No Render, clique em "New +" → "PostgreSQL"
2. Configure:
   - Name: `raspa-da-sorte-db`
   - Database: `raspa_db`
   - User: `postgres`
3. Clique em "Create Database"
4. Copie a "Internal Database URL"
5. Use no Render como DATABASE_URL

## Formato da URL:
```
postgresql://username:password@host:port/database
``` 