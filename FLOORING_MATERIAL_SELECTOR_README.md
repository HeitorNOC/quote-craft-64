# Como Usar FlooringMaterialSelector

## Componente Simplificado para Flooring

Apenas 2 abas:
- 🔍 **Home Depot** - Busca via SerpAPI
- ✏️ **Manual** - Entrada manual do preço

## Uso Rápido

```typescript
import FlooringMaterialSelector from '@/components/FlooringMaterialSelector';
import { useServiceStore } from '@/store/useServiceStore';

function MyFlooringStep() {
  const store = useServiceStore();
  
  const handleSelect = (material, manual, source) => {
    if (material) {
      store.setFlooringMaterial(material);
    } else if (manual) {
      store.setManualMaterial(manual);
    }
  };

  return (
    <FlooringMaterialSelector
      flooringType="vinyl flooring"
      onSelect={handleSelect}
    />
  );
}
```

## Configuração Obrigatória

Crie `.env.local` na raiz do projeto:

```env
VITE_SERPAPI_API_KEY=sua_chave_aqui
```

**Sem a chave:** App retorna aviso, mas continua funcionando (force Manual)

**Com a chave:** Busca produtos reais do Home Depot

## Tipos

```typescript
interface FlooringMaterialSelectorProps {
  onSelect: (
    material: MaterialOption | null,
    manual: { name: string; pricePerSqFt: number } | null,
    source: MaterialSource | 'Manual'
  ) => void;
  flooringType?: string;  // Pré-preenchimento
}
```

## Status

✅ Build: 1755 modules, 0 errors
✅ Pronto para usar em Flooring.tsx
