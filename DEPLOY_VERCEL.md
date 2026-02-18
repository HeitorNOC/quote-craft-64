# Deploy na Vercel (Sem Banco de Dados)

## ✅ Arquitetura

```
┌─────────────────────────────────┐
│  Frontend (React + Vite)        │  → Vercel Static
├─────────────────────────────────┤
│  API Route: /api/search-flooring│  → Vercel Serverless Function
├─────────────────────────────────┤
│  SerpAPI (Home Depot Search)    │  → External API
└─────────────────────────────────┘

Fluxo:
1. User busca "vinyl flooring"
2. Frontend POST /api/search-flooring
3. Vercel Serverless Function recebe request
4. Function chama SerpAPI com chave segura
5. Response retorna para frontend
```

## 🚀 Deploy Rápido

### Pré-requisitos
- Conta Vercel (grátis): https://vercel.com
- Git repo (GitHub/GitLab/Bitbucket)
- SerpAPI key: https://serpapi.com
- Código já feito ✅

### Passos

#### 1. **Push para Git**
```bash
git add .
git commit -m "Add Vercel serverless function for SerpAPI"
git push
```

#### 2. **Conectar Vercel**
```bash
npm install -g vercel
vercel
```

Ou no dashboard:
1. Acesse https://vercel.com
2. Import Project
3. Selecione seu repo
4. Clique "Deploy"

#### 3. **Configurar Variável de Ambiente**
Na Vercel Dashboard:
1. Project → Settings → Environment Variables
2. Adicione:
   - Name: `SERPAPI_API_KEY`
   - Value: sua chave de https://serpapi.com
3. Apply

#### 4. **Redeploy**
```bash
vercel --prod
```

Ou clique "Redeploy" no dashboard.

#### 5. ✅ Pronto!
Seu app está ao vivo em: `https://seu-projeto.vercel.app`

## 📁 Estrutura de Arquivos

```
quote-craft-64/
├── src/                          ← Frontend React
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   │   └── useHomeDepotSearch.ts (chama /api/search-flooring)
│   └── ...
├── api/
│   └── search-flooring.ts        ← Vercel Serverless Function
├── dist/                         ← Build output (deployed)
├── vercel.json                   ← Configuração Vercel
├── .env.local                    ← Dev (local)
├── package.json
└── vite.config.ts
```

## 🔒 Segurança

### Frontend (Público)
- ❌ Nunca expõe chaves API
- ✅ Faz requests POST para `/api/search-flooring`
- ✅ Rate limiting no cliente (cache, debounce, throttle)

### Serverless Function (Privado)
- ✅ Chave fica em variáveis de ambiente (não no código)
- ✅ Input validation
- ✅ Timeout de 10s
- ✅ Fallback automático

### Fluxo Seguro
```
Frontend                          Backend                      SerpAPI
   │                                │                             │
   └─→ POST /api/search-flooring ─→ │                             │
                                    └──→ chama com chave ────────→ │
                                                                   │
                                    ← response ← response ←────────┘
   ← JSON resultado ← ← ← ← ← ← ← ← ┘
```

## 💰 Custos

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | **$0** (grátis) |
| Vercel | Pro | $20/mês (se precisar) |
| SerpAPI | Free | **$0** (100 créditos/mês) |
| SerpAPI | Paid | $10-100/mês |

**Total Mínimo: $0.00**

## 📊 Uso de Créditos SerpAPI

Com rate limiting:
- 10 buscas/minuto máximo
- Cache 30 minutos
- Throttle 5 minutos per query
- ~50 créditos por usuário ativo/mês (100 créditos gratuitos)

## 🐛 Troubleshooting

### Erro: "API not configured"
**Solução:** Adicione `SERPAPI_API_KEY` em Vercel Settings

### Erro: "Query muito longa"
**Solução:** Limite é 100 caracteres, trunca automaticamente

### Erro: "Method not allowed"
**Solução:** Função só aceita POST, frontend usa POST ✅

### Função retorna fallback
**Normal:** Quando SerpAPI falha, retorna sugestões (sem quebrar)

## 📝 Variáveis de Ambiente

### Local (.env.local)
```env
SERPAPI_API_KEY=seu_key_aqui
```

### Vercel (Dashboard → Settings → Environment Variables)
```
SERPAPI_API_KEY = seu_key_aqui
```

## 🔄 CI/CD Automático

Vercel faz deploy automático quando você faz push:

```
git push → GitHub/GitLab → Vercel → Deploy ✅
```

## 📈 Monitoramento

Na Vercel Dashboard:
- **Functions** → Veja uso da serverless function
- **Analytics** → Traffic, performance
- **Logs** → Debug errors

## 🎯 Checklist de Deploy

- [ ] Git repo criado e conectado
- [ ] `vercel.json` presente
- [ ] `api/search-flooring.ts` criado ✅
- [ ] Hook atualizado para chamar `/api` ✅
- [ ] Conta SerpAPI com chave ✅
- [ ] Vercel configurado com `SERPAPI_API_KEY` ✅
- [ ] Deploy realizado
- [ ] Testar busca de flooring
- [ ] Validar rate limiting UI

## 🚀 Deploy Agora

```bash
# Local: teste primeiro
npm run dev

# Depois: deploy
vercel --prod
```

## ℹ️ Links Úteis

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/concepts/functions/serverless-functions
- SerpAPI Docs: https://serpapi.com/docs
- Variáveis de Ambiente: https://vercel.com/docs/build-output-api/environment-variables
