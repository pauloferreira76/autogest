# AutoGest — Layout Responsivo

## Arquivos incluídos

```
autogest-responsive/
├── src/
│   ├── app/
│   │   ├── globals.css                           → src/app/globals.css
│   │   └── (dashboard)/layout.tsx                → src/app/(dashboard)/layout.tsx
│   └── components/dashboard/
│       ├── Sidebar.tsx                           → src/components/dashboard/Sidebar.tsx
│       ├── Topbar.tsx                            → src/components/dashboard/Topbar.tsx
│       ├── BottomNav.tsx                         → src/components/dashboard/BottomNav.tsx
│       └── DashboardShell.tsx                    → src/components/dashboard/DashboardShell.tsx
```

## Como aplicar

Copie os arquivos e faça o deploy:

```bash
git add .
git commit -m "layout responsivo — mobile, tablet e desktop"
git push origin main
```

Na VM:
```bash
cd /var/www/autogest
git pull origin main
npm run build
pm2 restart autogest --update-env
```

## O que foi implementado

### Mobile (< 768px)
- Sidebar escondida por padrão, abre com botão hamburguer
- Overlay escuro ao abrir o menu com blur
- Bottom Navigation Bar com 5 ícones (Início, Veículos, Manutenções, Despesas, IA)
- Touch targets mínimos de 44px em todos os botões
- Padding seguro para notch e home indicator (safe-area-inset)
- Botão CTA encurtado ("Novo" em vez do texto completo)
- Painel de notificações adaptado para largura da tela

### Tablet (768px - 1023px)
- Sidebar hamburguer (mesmo padrão do mobile)
- Grid de 2 colunas para métricas
- Layout de conteúdo em coluna única

### Desktop (≥ 1024px)
- Sidebar fixa na esquerda
- Grid de 4 colunas para métricas
- Layout de 2 colunas no dashboard
- Topbar sem botão hamburguer

### Grids responsivos (use nas páginas)
- `.metrics-grid` — 4 cols → 2 cols → 2 cols
- `.dashboard-grid` — 1.5fr 1fr → 1fr
- `.two-col` — 1fr 1fr → 1fr
- `.three-col` — 3 cols → 2 cols → 1 col
- `.form-grid-2` — 2 cols → 1 col
- `.config-layout` — horizontal → vertical (abas)
- `.table-wrap` — scroll horizontal em tabelas
