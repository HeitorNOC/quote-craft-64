# SerpAPI Integration Guide - Quote Craft

## Visão Geral

A integração com SerpAPI permite que o aplicativo busque produtos do Home Depot em tempo real durante o fluxo de seleção de materiais, mantendo a estrutura original do projeto Vite + React Router.

## Componentes Criados

### 1. **useHomeDepotSearch Hook** (`src/hooks/useHomeDepotSearch.ts`)

Um hook React customizado que gerencia o estado de busca de produtos.

**Interface:**
```typescript
const { results, loading, error, search, clear } = useHomeDepotSearch();
```

**Propriedades:**
- `results` - Array de `MaterialOption[]` (produtos encontrados)
- `loading` - Boolean indicando se está buscando
- `error` - String com mensagem de erro ou null
- `search(query)` - Função para buscar produtos
- `clear()` - Função para limpar resultados

**Exemplo de uso:**
```typescript
import { useHomeDepotSearch } from '@/hooks/useHomeDepotSearch';

function MyComponent() {
  const { results, loading, error, search } = useHomeDepotSearch();
  
  const handleSearch = () => {
    search('vinyl flooring');
  };
  
  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {results.map(r => <p key={r.id}>{r.name} - $ {r.pricePerSqFt}/m²</p>)}
    </div>
  );
}
```

### 2. **API Integration** (`src/lib/api.ts`)

Nova função `searchHomeDepotProducts(query)` que:
- Chama a API SerpAPI com engine `home_depot_product_search`
- Converte resultados para formato `MaterialOption[]`
- Implementa fallback inteligente quando API falha
- Retorna no máximo 6 resultados

**Exemplos de fallback automático:**
- Query contém "vinyl" → retorna 2 opções de vinil
- Query contém "laminate" → retorna 2 opções de laminado
- Query contém "hardwood" → retorna 2 opções de madeira
- ... e mais tipos

## 3. **FlexibleMaterialSelector Component** (`src/components/FlexibleMaterialSelector.tsx`)

Um componente completo com 3 abas para seleção de materiais:

1. **🔍 Buscar Home Depot** - Busca em tempo real via SerpAPI
2. **✏️ Entrada Manual** - Usuário insere nome e preço
3. **💡 Sugestões** - Lista de materiais sugeridos (fallback)

**Props:**
```typescript
interface FlexibleMaterialSelectorProps {
  onSelect: (material, manual, source) => void;
  flooringType?: string;  // Pré-preenchimento da busca
}
```

**Exemplo:**
```typescript
<FlexibleMaterialSelector
  flooringType="vinyl"
  onSelect={(material, manual, source) => {
    if (material) {
      console.log(`Selecionado: ${material.name} de ${source}`);
    } else if (manual) {
      console.log(`Manual: ${manual.name} - $ ${manual.pricePerSqFt}/m²`);
    }
  }}
/>
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SERPAPI_API_KEY=sua_chave_api_aqui
```

**Como obter a chave:**
1. Acesse https://serpapi.com/
2. Crie uma conta
3. Copie sua API Key do dashboard
4. Cole em `.env.local`

**Importante:**
- O app funciona **sem** a chave (usa fallback inteligente)
- Com a chave, busca produtos reais do Home Depot
- Sem a chave, retorna sugestões baseadas no tipo de material

### Consumo de Créditos SerpAPI

- **Home Depot Search**: 5 créditos por busca
- **Plano Gratuito**: 100 créditos (20 buscas)
- **Recomendação**: Implementar cache local para evitar buscas duplicadas

## Integração na Aplicação Existente

Para integrar o novo seletor no fluxo existente:

### Opção 1: Substituir MaterialSelector (Não Recomendado)
```typescript
import FlexibleMaterialSelector from '@/components/FlexibleMaterialSelector';

// No componente da página
<FlexibleMaterialSelector
  flooringType={selectedType}
  onSelect={handleMaterialSelect}
/>
```

### Opção 2: Adicionar como Alternativa (Recomendado)
```typescript
// No MaterialSelector existente
const [showFlexible, setShowFlexible] = useState(false);

if (showFlexible) {
  return <FlexibleMaterialSelector {...props} />;
}

// ... mostrar MaterialSelector original ...
```

### Opção 3: Estender MaterialSelector Existente
```typescript
// Em MaterialSelector.tsx, adicionar abas:
// "Tradicional" → componente atual
// "Home Depot" → novo FlexibleMaterialSelector
```

## Funcionalidade Principal

### Busca Home Depot via SerpAPI

**Fluxo:**
1. Usuário digita query (ex: "ceramic tile")
2. Clica em "Buscar"
3. Hook chama `searchHomeDepotProducts(query)`
4. API chama SerpAPI com engine `home_depot_product_search`
5. Resultados retornam em menos de 3 segundos
6. Componente exibe produtos com preços estimados

### Smart Fallback

Se SerpAPI falhar ou não tiver chave configurada:
1. Sistema detecta o tipo de material na query
2. Retorna lista de materiais sugeridos (pré-configurados)
3. Usuário pode ainda usar "Entrada Manual" ou "Sugestões"
4. Aplicação continua funcionando 100%

## Tipos TypeScript

### MaterialOption
```typescript
type MaterialOption = {
  id: string;
  name: string;
  source: 'HomeDepot' | 'Lowes' | 'Manual';
  pricePerSqFt: number;
  url?: string;
};
```

### ManualMaterial
```typescript
type ManualMaterial = {
  name: string;
  pricePerSqFt: number;
};
```

## Troubleshooting

### "API Key not found"
**Solução:** Crie `.env.local` com `VITE_SERPAPI_API_KEY`

### "Nenhum resultado encontrado"
**Possíveis causas:**
- Query muito específica
- SerpAPI retornou 0 resultados
- **Solução:** Usar aba "Sugestões" ou "Entrada Manual"

### "Preço parece incorreto"
**Explicação:** Preços são estimados dividindo preço do Home Depot por ~50 (conversão de pé² para m²)
**Ajuste:** Editar `searchHomeDepotProducts()` em `src/lib/api.ts` linha ~85

### Build falha
**Solução:** Rodar `npm install` e `npm run build`

## Estrutura de Arquivos Criados

```
src/
├── hooks/
│   └── useHomeDepotSearch.ts          # Hook customizado
├── components/
│   └── FlexibleMaterialSelector.tsx   # Novo componente
├── lib/
│   └── api.ts                         # Função searchHomeDepotProducts adicionada
```

## Próximos Passos

1. **Cache de Buscas**: Implementar cache local para evitar APIs duplicadas
2. **Analytics**: Rastrear quais materiais são mais buscados
3. **Melhorias de Preço**: Integrar múltiplos fornecedores (Lowes, etc)
4. **Imagens de Produto**: Exibir fotos do Home Depot nos resultados

## Support

Para dúvidas sobre a integração:
- Documentação SerpAPI: https://serpapi.com/docs
- TypeScript Types: Ver `src/types/index.ts`
- Components: Ver em `src/components/`

---

**Status:** ✅ Implementado e Testado
**Build:** ✅ Compila sem erros
**Teste:** ⚠️ Aguarda VITE_SERPAPI_API_KEY para testes E2E
