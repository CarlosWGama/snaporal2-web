# Data Model: Remoção de Imagem do Dataset

**Feature**: `002-delete-dataset-image`  
**Data**: 2026-10-31  
**Status**: Concluído

## 1. Entidades e Tipos TypeScript

### Entidade: `DatasetItem` (Referência do Registro)
Representa o registro individual de imagem armazenada no dataset recuperado do backend.

```typescript
export interface DatasetUser {
  name: string;
  email: string;
}

export type DatasetPathologyType = 'cancer' | 'qa' | 'eritroplasia' | 'leucoplasia';

export interface DatasetItem {
  id: number;
  image_url: string;
  type: string;
  positive: boolean;
  assurance: number;
  created_at: string;
  user: DatasetUser;
}
```

---

### Resposta de Operação de Exclusão: `DatasetDeleteResponse`
Contrato de retorno padronizado para a chamada do método de deleção na camada de serviço.

```typescript
export interface DatasetDeleteResponse {
  success: boolean;
  error?: string;
}
```

---

## 2. Modelo de Estado de Interface (UI State)

No Client Component `src/app/admin/dataset/_list.tsx`, novos estados reativos governam o ciclo de vida da exclusão:

| Estado | Tipo | Descrição | Valor Inicial |
| :--- | :--- | :--- | :--- |
| `itemToDelete` | `DatasetItem \| null` | Item selecionado na tabela para remoção | `null` |
| `isDeleting` | `boolean` | Indica se a requisição DELETE está em andamento | `false` |
| `deleteError` | `string \| null` | Mensagem de erro capturada caso a exclusão falhe | `null` |

---

## 3. Ciclo de Vida e Transições de Estado

```text
[Tabela de Registros]
        │
        ▼ (Usuário clica no botão "Remover")
[itemToDelete = item] ──► Modal de Confirmação Aberto
        │
        ├──► (Usuário clica em "Cancelar" ou fecha modal)
        │         └──► itemToDelete = null (retorna à tabela sem alterações)
        │
        └──► (Usuário clica em "Confirmar Remoção")
                  │
                  ▼
          [isDeleting = true] (Desabilita botões e mostra carregamento)
                  │
                  ├──► [Sucesso]
                  │         ├──► Fecha modal (itemToDelete = null)
                  │         ├──► Recarrega dataset via loadDataset(page)
                  │         └──► [isDeleting = false]
                  │
                  └──► [Falha]
                            ├──► Exibe mensagem em deleteError
                            └──► [isDeleting = false] (permite fechar ou retentar)
```
