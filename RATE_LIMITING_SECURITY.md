# Rate Limiting & Abuse Protection

## Problema
Usuários mal intencionados (ou bots) poderiam explorar a API SerpAPI fazendo requisições excessivas, estourando a cota mensal e causando custos desnecessários.

## Solução Implementada

### 1. **Client-Side Protection** (Hook: `useHomeDepotSearch.ts`)

#### A. Cache Local (30 minutos)
```
Primeira busca:  "vinyl flooring" → SerpAPI → 6 resultados → Cache
Segunda busca:   "vinyl flooring" → Cache Hit → Instantâneo (sem API)
```
- Evita requisições duplicadas
- Reduz latência
- Não consome créditos SerpAPI

#### B. Rate Limiting (10 requisições/minuto)
- Máximo 10 buscas por minuto por usuário
- Tracked por timestamp local
- Se atingir limite: mostra aviso com horário de próxima busca

**Calculado como:**
```
MAX_REQUESTS_PER_MINUTE = 10
TIME_WINDOW = 60 segundos
remaining = 10 - (requests nos últimos 60s)
```

#### C. Debounce (300ms)
- Espera usuário parar de digitar antes de buscar
- Evita múltiplas requisições enquanto continua digitando
- Melhora UX e reduz API calls

**Cenário:**
```
User digita: v-i-n-y-l (5 caracteres)
Sem debounce: 5 requisições
Com debounce:  1 requisição (após parar de digitar)
```

#### D. Throttle (5 minutos por termo)
- Mesmo termo não pode ser buscado 2x em menos de 5 minutos
- Se tentar: mostra "Essa busca foi feita há pouco"
- Força diversidade de buscas

**Raciocínio:**
```
Se usuário busca "vinyl flooring" 10x em 30s:
- Sem throttle: 10 requisições
- Com throttle: 1 requisição (resto bloqueado)
```

#### E. Timeout (10 segundos)
- Requisições que levam >10s são canceladas
- Evita requisições penduradas consumindo recursos

### 2. **Server-Side Protection** (API: `searchHomeDepotProducts()`)

#### A. Input Validation
- ✅ Verifica se query é string
- ✅ Rejeita queries > 100 caracteres
- ✅ Rejeita padrões suspeitos: `<>"\`{}\|\\`

**Exemplos bloqueados:**
```
❌ "<script>alert('xss')</script>"
❌ "vim\nhttpurldomain.com.fakeserpapi.com"
❌ "OR 1=1"
❌ Queries > 100 chars (trunca com fallback)
```

#### B. Timeout de Requisição
- Limite de 10 segundos por request SerpAPI
- Cancela se SerpAPI não responder a tempo
- Evita conexões travadas

#### C. Logging de Monitoramento
- Logs em console para suspeitas
- Facilita detecção de patterns de abuso

### 3. **UI/UX Feedback** (Component: `FlooringMaterialSelector.tsx`)

Mostra status em tempo real:

```
Status                        | Cor    | Mensagem
------------------------------------------
Buscas disponíveis (> 3)     | Verde  | "🔄 8 buscas restantes"
Buscas baixas (1-3)          | Amarelo| "🔄 2 buscas restantes"
Limite atingido              | Vermelho| "⏸️ Próxima em 8:15:30 PM"
Botão de busca              | -      | Desabilitado se remaing = 0
```

### 4. **Arquitetura de Defesa em Camadas**

```
┌─────────────────────────────────────┐
│  User Request                       │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ Client: Debounce (300ms)            │ ← Evita múltiplos clicks
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ Client: Cache Check (30 min)        │ ← Economiza API calls
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ Client: Throttle Check (5 min)      │ ← Força diversidade
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ Client: Rate Limit (10/min)         │ ← Bloqueia abuso
└────────────┬────────────────────────┘
             │ [Se tudo ok]
┌────────────▼────────────────────────┐
│ Server: Input Validation            │ ← Sanitização
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ Server: Request Timeout (10s)       │ ← Evita travamento
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ SerpAPI: Request                    │
└─────────────────────────────────────┘
```

## Cenários de Segurança

### Cenário 1: Usuário Legítimo
```
Ação                | Proteção              | Resultado
------------------------------------------
Busca "vinyl"      | Nenhuma (cache miss)  | ✅ 1 requisição API
Busca "vinyl"      | Cache hit             | ✅ 0 requisições API
Espera 5 min       | Throttle expire       | ✅ Cache renovada
```

### Cenário 2: Usuário Digitando Rápido
```
Ação                          | Proteção              | Resultado
------------------------------------------------------------------------
Digita "v-i-n-y-l flooring"  | Debounce (300ms)      | ✅ 1 requisição (ao parar)
```

### Cenário 3: Clicker Malicioso
```
Ação                  | Proteção                  | Resultado
--------------------------------------------------------------------
Clica "Buscar" 15x    | Rate limit (10/min)       | ⚠️ 10 permitidas, 5 bloqueadas
                      | Debounce                  | ⚠️ Requests agrupadas
```

### Cenário 4: Bot Automatizado
```
Ação                      | Proteção              | Resultado
----------------------------------------------------------
500 requisições/min       | Rate limit (10/min)   | ⚠️ 10 permitidas
Mesma query 10x/min       | Throttle (5 min)      | ⚠️ 1 permitida
Queries suspeitas         | Input validation      | ❌ Rejeitadas
```

## Impacto na Cota SerpAPI

### Sem Proteção
- 1 usuário clicando 100x = 100 requisições = 500 créditos ❌

### Com Proteção
- 1 usuário clicando 100x = ~10 requisições = 50 créditos ✅
- **Redução: 90%**

### Plano Gratuito
- 100 créditos/mês = ~15-20 buscas
- Com proteção: suficiente para ~500 interações de usuário
- **Multiplicador: 25-33x**

## Variáveis Configuráveis

Para ajustar proteção, edite em `src/hooks/useHomeDepotSearch.ts`:

```typescript
const MAX_REQUESTS_PER_MINUTE = 10;  // ← Aumentar/diminuir
const CACHE_TTL = 30 * 60 * 1000;    // ← 30 minutos
const THROTTLE_INTERVAL = 5 * 60 * 1000;  // ← 5 minutos
const DEBOUNCE_MS = 300;  // ← Aumentar para mais delay
```

## Monitoramento

### Console Logs para Debug
```javascript
// Cache hit
📦 Usando cache para: vinyl flooring

// Throttle acionado
⏱️ Essa busca foi feita há pouco. Tente novamente em 5 minutos.

// Rate limit acionado
⚠️ Limite de requisições atingido. Tente novamente em 8:15:30 PM

// Input inválido
Query muito longa (>100 chars), truncando
Query contém caracteres inválidos

// API error
🏠 Home Depot search failed: [error details]
```

## Melhorias Futuras

- [ ] Backend rate limiting (por IP/session)
- [ ] CAPTCHA após N requisições
- [ ] Bloqueio temporário de IPs suspeitos
- [ ] Analytics: rastrear patterns de abuso
- [ ] SerpAPI webhook para alertas de cota
- [ ] Redis cache compartilhado (múltiplos usuários)
- [ ] JWT tokens com quotas personalizadas

## Status de Implementação

✅ Cache local (30 min)
✅ Rate limiting (10/min)
✅ Debounce (300ms)
✅ Throttle (5 min)
✅ Timeout (10s)
✅ Input validation
✅ UI feedback
✅ Logging
⏳ Backend rate limiting (futura)
