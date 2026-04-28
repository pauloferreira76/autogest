# AutoGest — Visual Premium

## Arquivos modificados

Copie cada arquivo para a pasta correspondente no seu projeto:

```
autogest-premium/
├── tailwind.config.ts                          → tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── globals.css                         → src/app/globals.css
│   │   ├── (auth)/login/page.tsx               → src/app/(auth)/login/page.tsx
│   │   └── (dashboard)/dashboard/page.tsx      → src/app/(dashboard)/dashboard/page.tsx
│   ├── components/dashboard/
│   │   ├── Sidebar.tsx                         → src/components/dashboard/Sidebar.tsx
│   │   └── Topbar.tsx                          → src/components/dashboard/Topbar.tsx
│   └── lib/
│       └── utils.ts                            → src/lib/utils.ts
```

## O que mudou

### Visual geral
- **Sidebar escura** — fundo `#0c0e1a` com avatar em gradiente azul→roxo
- **Fundo** — `#f1f4fb` (azulado suave, mais profissional que branco puro)
- **Bordas** — `1.5px` em toda a interface, mais definição
- **Tipografia** — Inter 800 nos títulos, JetBrains Mono nos números

### Botões (5 variantes)
- `btn-primary` — azul royal `#1a56db`
- `btn-emerald` — verde esmeralda `#059669`
- `btn-violet`  — roxo `#7c3aed`
- `btn-outline-brand` — fundo azul claro, texto azul
- `btn-danger`  — fundo rose, texto escuro rose

### Metric cards
- Barra colorida de 3px no topo indicando a categoria
- Ícone com fundo colorido
- Valor em Inter 800 com letter-spacing negativo

### Badges
- Bordas coloridas + fundo colorido (mais nítidos)
- 6 variantes: brand, emerald, amber, rose, violet, gray

## Deploy

```bash
git add .
git commit -m "visual premium — sidebar dark, botões impactantes, nova paleta"
git push
```
