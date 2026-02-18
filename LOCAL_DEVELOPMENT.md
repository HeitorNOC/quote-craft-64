# Desenvolvimento Local com Vercel Serverless Functions

## 🏃 Testar Localmente

### Opção 1: Usando Vite (sem serverless)
```bash
npm run dev
```
- ✅ Frontend funciona
- ⚠️ API retorna erro CORS (esperado)
- 📱 Fallback automático para sugestões

### Opção 2: Usando Vercel CLI (com serverless) ⭐ RECOMENDADO
```bash
npm install -g vercel
vercel dev
```

Isso vai:
1. Simular o ambiente Vercel localmente
2. Rodar frontend + serverless functions
3. Testar SerpAPI antes de fazer deploy
4. Usar `.env.local` automaticamente

**Resultado:**
- ✅ Frontend em http://localhost:3000
- ✅ API em http://localhost:3000/api/search-flooring
- ✅ Sem CORS
- ✅ Chave segura

## 📦 Package.json Scripts Úteis

Já estão prontos em seu projeto:
```bash
npm run dev       # Vite dev server
npm run build     # Production build
```

Para adicionar no futuro:
```bash
# package.json
{
  "scripts": {
    "vercel-dev": "vercel dev",
    "vercel-prod": "vercel --prod"
  }
}
```

## 🔧 Workflow de Desenvolvimento

### Local Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2 (opcional): Vercel simulator
vercel dev

# Abrir http://localhost:3000
```

### Testar Flooring
1. Clique em "Flooring"
2. Preencha formulário
3. Quando chegar em "Escolha o Material"
4. Digite algo (ex: "vinyl")
5. Clique "Buscar"

**Esperado:**
- ✅ Carregamento
- ✅ Resultados aparecem
- ✅ Status de rate limit mostra "🔄 9 buscas restantes"

### Deploy
```bash
# Quando pronto
git add .
git commit -m "Ready for Vercel"
git push

# Vercel faz deploy automático
# Ou manual:
vercel --prod
```

## 🐛 Se Busca Não Funciona

### Erro: "Fetch failed"
**Causa:** CORS (esperado com `npm run dev`)  
**Solução:** Use `vercel dev` para testar com serverless

### Erro: "API not configured"
**Causa:** `SERPAPI_API_KEY` não está em `.env.local`  
**Solução:** Adicione sua chave em `.env.local`:
```env
SERPAPI_API_KEY=sua_chave_aqui
```

### Erro: "Query contém caracteres inválidos"
**Causa:** Query tem caracteres perigosos  
**Solução:** Digite apenas letras, números, espaços

### Resultados vazios ou fallback
**Normal:** SerpAPI retornou vazio ou erro  
**Sistema:** Mostra sugestões de fallback (funciona tudo!)

## 📊 Checklist Local

- [ ] `.env.local` tem `SERPAPI_API_KEY`
- [ ] `npm run dev` funciona
- [ ] Frontend carrega
- [ ] Consegue navegar até "Escolha Material"
- [ ] Busca retorna resultados OU fallback
- [ ] UI mostra rate limit counter
- [ ] Segundo clique rápido mostra cache
- [ ] Mesmo termo 2x = throttle (5 min)

## ✨ Como Funciona em Desenvolvimento

### Com `npm run dev` (Vite apenas)
```
Browser        Vite Dev
  │              │
  ├─→ GET /  ────→
              (index.html + bundle.js)
  
  ├─→ POST /api/search-flooring ────X
              ↓
            CORS Error ❌
            
            Fallback automático ✅
```

### Com `vercel dev` (Vite + Serverless)
```
Browser        Vercel CLI
  │              │
  ├─→ GET /  ────→ Vite (frontend)
                  
  ├─→ POST /api/search-flooring ───→ api/search-flooring.ts
                                      │
                                      └─→ SerpAPI
                                      
  ← response ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## 🚀 Próximos Passos

1. **Testar Localmente**
   ```bash
   npm run dev
   # Navegue até Flooring → Material
   # Veja que busca falha (CORS esperado)
   # Fallback funciona (sugestões aparecem)
   ```

2. **Deploy na Vercel**
   ```bash
   vercel --prod
   # Tudo funciona! Sem CORS, Serverless rodando
   ```

3. **Monitorar**
   - Vercel Dashboard → Functions
   - Veja uso de serverless
   - Monitore performance

## 📞 Suporte

**Erro local?** Significa que:
- Frontend está ok ✅
- Apenas API (serverless) não funciona localmente
- Isso é esperado com `npm run dev`
- Em produção (Vercel) funciona perfeitamente

**Use `vercel dev` para testar serverless localmente antes de fazer deploy.**
