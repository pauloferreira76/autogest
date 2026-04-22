# AutoGest — Gestão Automotiva Inteligente

SaaS para controle de veículos, manutenções e despesas com assistente IA integrado.

## Stack

- **Next.js 15** (App Router + TypeScript)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Tailwind CSS**
- **Claude API** (Anthropic) — assistente IA
- **Vercel** — deploy

## Setup local

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas chaves reais:
- **Supabase**: pegue em [app.supabase.com](https://app.supabase.com) → Project Settings → API
- **Anthropic**: pegue em [console.anthropic.com](https://console.anthropic.com)

### 3. Configure o banco de dados

No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo `supabase-schema.sql`.

### 4. Configure autenticação com Google (opcional)

No Supabase: **Authentication → Providers → Google → Enable**

Crie credenciais OAuth em [console.cloud.google.com](https://console.cloud.google.com).

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Estrutura de pastas

```
src/
├── app/
│   ├── (auth)/          # Rotas públicas: login, cadastro
│   ├── (dashboard)/     # Rotas protegidas: dashboard, veículos, etc.
│   ├── api/
│   │   ├── ia/          # Endpoint do assistente IA (Claude)
│   │   └── webhooks/    # Webhooks do Stripe
│   └── auth/callback/   # Callback OAuth do Supabase
├── components/
│   └── dashboard/       # Sidebar, Topbar
├── lib/
│   ├── supabase.ts      # Cliente browser
│   ├── supabase-server.ts # Cliente server-side
│   └── utils.ts         # Funções auxiliares
└── types/               # Tipos TypeScript
```

## Deploy na Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça o deploy
vercel

# Adicione as variáveis de ambiente no painel da Vercel
# Configurações → Environment Variables
```

## Roadmap

- [x] Autenticação (e-mail + Google)
- [x] CRUD de veículos
- [x] CRUD de manutenções
- [x] CRUD de despesas
- [x] Assistente IA com Claude
- [ ] OCR de notas fiscais
- [ ] Notificações por e-mail (Resend)
- [ ] Planos e pagamentos (Stripe)
- [ ] Relatórios e gráficos
- [ ] App mobile (React Native)
