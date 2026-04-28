# AutoGest — OCR + Relatórios

## Arquivos incluídos

```
autogest-modules/
├── src/
│   ├── app/
│   │   ├── api/ocr/route.ts                          → src/app/api/ocr/route.ts
│   │   └── (dashboard)/
│   │       ├── despesas/nova/page.tsx                → src/app/(dashboard)/despesas/nova/page.tsx
│   │       └── relatorios/page.tsx                   → src/app/(dashboard)/relatorios/page.tsx
│   └── components/dashboard/
│       ├── Sidebar.tsx                               → src/components/dashboard/Sidebar.tsx
│       └── Topbar.tsx                                → src/components/dashboard/Topbar.tsx
```

## Como aplicar

Copie os arquivos para as pastas correspondentes e faça o deploy:

```bash
git add .
git commit -m "adiciona OCR de notas fiscais e relatórios com gráficos"
git push origin main
```

Na VM:
```bash
cd /var/www/autogest
git pull origin main
npm run build
pm2 restart autogest --update-env
```

## Como funciona o OCR

1. Usuário acessa "Nova Despesa"
2. Clica em "Escanear nota fiscal" e faz upload da imagem
3. A API `/api/ocr` envia a imagem para o Claude Vision
4. Claude extrai: valor, data, descrição, categoria e estabelecimento
5. O formulário é preenchido automaticamente
6. Usuário revisa e salva

Formatos suportados: JPG, PNG, WEBP, PDF (máx. 10MB)

## Relatórios

Acesse em: `/dashboard/relatorios`

Gráficos disponíveis:
- **Gastos por mês** — barras com comparativo anual
- **Por categoria** — pizza com percentuais
- **Por veículo** — barras horizontais com custo/km

Filtros: por ano e por veículo

Exportação:
- **CSV** — abre o Excel direto com todos os dados
- **PDF** — usa o print do navegador (Ctrl+P)
