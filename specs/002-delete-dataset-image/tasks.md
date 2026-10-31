---
description: "Lista de tarefas para implementação da Remoção de Imagem do Dataset"
---

# Tasks: Remoção de Imagem do Dataset

**Input**: Documentos de design em `specs/002-delete-dataset-image/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)  
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/dataset-delete-api.json`  
**Constitution**: Redação de tarefas e documentação em português; interfaces e mensagens de usuário estritamente em pt-BR; comunicação com backend governada centralmente via `src/services/api.ts`.  

## Formato: `[ID] [P?] [Story] Descrição com caminho do arquivo`

- **[P]**: Tarefa executável em paralelo (arquivos distintos, sem dependência bloqueante)
- **[Story]**: Identificador da história de usuário associada (`[US1]`, `[US2]`, `[US3]`)
- Todos os itens incluem caminhos exatos dos arquivos

---

## Phase 1: Setup (Tipagem e Estrutura Básica)

**Objetivo**: Declaração dos tipos TypeScript para suporte à resposta de remoção

- [X] T001 [P] Declarar a interface de resposta `DatasetDeleteResponse` em `src/services/dataset.ts`

---

## Phase 2: Foundational (Camada de Serviço Centralizada)

**Objetivo**: Implementação do método de deleção no serviço para consumo seguro pela interface

**⚠️ CRITICAL**: Nenhuma história de usuário de interface pode concluir a integração de remoção sem este método de serviço

- [X] T002 Implementar o método `delete(id: number)` no objeto `DatasetServices` em `src/services/dataset.ts` enviando requisição autenticada para `DELETE /dataset/{id}` via `api.delete` com tratamento de erros em português

**Checkpoint**: Camada de serviço pronta - integração visual e fluxos de usuário podem ser iniciados

---

## Phase 3: User Story 1 - Ação de Exclusão com Diálogo de Confirmação Irreversível (Priority: P1) 🎯 MVP

**Objetivo**: Disponibilizar o botão de remoção na tabela ao lado do botão de abrir imagem e abrir o modal com o aviso explícito de irreversibilidade

**Critério de Teste Independente**: Acessar a tabela do dataset, identificar o botão de remoção na coluna Ações de qualquer linha, clicar nele e verificar a abertura do modal com o aviso: *"Você realmente quer remover essa imagem? Ao confirmar a remoção da imagem, ela será excluída e não poderá mais ser recuperada."*

- [X] T003 [US1] Adicionar o botão de remoção com ícone de lixeira e estilo semântico de perigo na coluna "Ações" da tabela em `src/app/admin/dataset/_list.tsx`, posicionado ao lado do botão de abrir/baixar imagem
- [X] T004 [US1] Declarar o estado `itemToDelete` e renderizar o componente `AppModal` em `src/app/admin/dataset/_list.tsx` exibindo o título de confirmação e a mensagem exata: "Você realmente quer remover essa imagem? Ao confirmar a remoção da imagem, ela será excluída e não poderá mais ser recuperada."

**Checkpoint**: User Story 1 funcional de forma independente como MVP (o usuário consegue acionar a intenção de remoção e visualizar o alerta)

---

## Phase 4: User Story 2 - Confirmação e Efetivação da Remoção da Imagem (Priority: P1)

**Objetivo**: Executar a chamada de exclusão no backend ao confirmar no modal, exibir estado de carregamento e atualizar a listagem da tabela

**Critério de Teste Independente**: Clicar em remover, confirmar a exclusão no modal e validar que a requisição `DELETE /dataset/{id}` é enviada, os botões são desabilitados durante o envio, o modal é fechado e o registro desaparece da tabela após recarregamento

- [X] T005 [US2] Implementar a função `handleConfirmDelete` em `src/app/admin/dataset/_list.tsx` invocando `DatasetServices.delete(itemToDelete.id)` e gerenciando o estado de carregamento `isDeleting`
- [X] T006 [US2] Integrar o tratamento de pós-exclusão e erro em `src/app/admin/dataset/_list.tsx`: fechar o modal em caso de sucesso, recarregar os dados da tabela tratando páginas vazias (`page > 1 && items.length === 1`), e exibir mensagem de erro em pt-BR caso a exclusão falhe

**Checkpoint**: User Stories 1 e 2 integradas, completando o fluxo ponta a ponta de remoção

---

## Phase 5: User Story 3 - Cancelamento da Remoção (Priority: P2)

**Objetivo**: Permitir que o administrador cancele o diálogo de confirmação sem efetuar alterações ou chamadas de rede

**Critério de Teste Independente**: Abrir o modal de confirmação e clicar no botão "Cancelar" ou no ícone de fechar, validando que o modal é dispensado e os dados da tabela permanecem intactos

- [X] T007 [US3] Conectar as ações de cancelamento no modal (botão "Cancelar" e propriedade `onClose`) em `src/app/admin/dataset/_list.tsx`, resetando os estados `itemToDelete` e `deleteError` sem disparar requisições

**Checkpoint**: Todas as histórias de usuário (US1, US2 e US3) implementadas e funcionais

---

## Phase 6: Polish & Cross-Cutting Concerns

**Objetivo**: Validação estática de tipos, conformidade de linting e validação dos cenários funcionais

- [X] T008 [P] Executar validação estática de tipos com `npx tsc --noEmit` e validação com `npm run lint` garantindo zero erros no projeto
- [X] T009 Executar a validação prática dos cenários operacionais descritos em `specs/002-delete-dataset-image/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências externas - pode ser iniciada imediatamente
- **Foundational (Phase 2)**: Depende de Setup (Phase 1) - bloqueia a conclusão das histórias de usuário
- **User Story 1 (Phase 3)**: Depende de Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depende de User Story 1 (Phase 3) e Foundational (Phase 2)
- **User Story 3 (Phase 5)**: Depende de User Story 1 (Phase 3)
- **Polish (Phase 6)**: Depende da conclusão de todas as histórias de usuário anteriores

### Parallel Opportunities

- `T001` em Setup pode rodar em paralelo com tarefas de documentação
- `T008` (validação de tipos) pode rodar em paralelo com a revisão dos arquivos modificados
- `T007` (cancelamento) pode ser desenvolvido de forma incremental assim que o modal de `T004` estiver criado

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational)
1. Concluir Phase 1 (Setup) e Phase 2 (Foundational - `DatasetServices.delete`).
2. Implementar Phase 3 (User Story 1 - botão na tabela e modal com a mensagem mandatória de irreversibilidade).
3. **Validar MVP**: Conferir se o botão está posicionado corretamente e o modal exibe o texto exato.

### Entrega Incremental Completa
1. Conectar Phase 4 (User Story 2 - confirmação de remoção, loading e recarregamento da tabela).
2. Conectar Phase 5 (User Story 3 - cancelamento seguro).
3. Executar Phase 6 (Polish - `tsc`, `lint` e cenários do `quickstart.md`).
