# Research: Remoção de Imagem do Dataset

**Feature**: `002-delete-dataset-image`  
**Data**: 2026-10-31  
**Status**: Concluído

## 1. Contexto e Objetivos

O objetivo desta pesquisa técnica é definir o padrão arquitetural, fluxo de interface e estratégia de comunicação para a exclusão segura e irreversível de imagens clínicas cadastradas no módulo **Dataset**.

---

## 2. Decisões Arquiteturais e Padrões

### Decisão 1: Método de Exclusão no Serviço (`src/services/dataset.ts`)
- **Decisão**: Adicionar o método `delete(id: number): Promise<{ success: boolean; error?: string }>` no objeto `DatasetServices`.
- **Rota e Método HTTP**: `DELETE /dataset/{id}`.
- **Tratamento de Autenticação**: O serviço utiliza a instância centralizada `api` (`src/services/api.ts`), que já possui interceptor de requisição configurado com injeção automática de `Authorization: Bearer <token>` a partir do cookie da sessão.
- **Tratamento de Erros**: Capturar erros via `try/catch` tratando exceções do Axios e extraindo `error.response?.data?.message` com fallback padrão em português: `"Falha ao excluir imagem do dataset."`.
- **Alternativas consideradas**:
  - *Chamada direta com fetch no componente*: Rejeitada por violar o Princípio III da Constituição (Camada Centralizada de Serviços e API via Axios).
  - *Passar token manualmente como parâmetro*: Rejeitada pois o interceptor já resolve a autenticação globalmente de forma segura.

---

### Decisão 2: Modal de Confirmação e Aviso de Irreversibilidade
- **Decisão**: Reutilizar o componente padrão `AppModal` (`src/themes/components/modal.tsx`) já presente e utilizado no projeto para confirmação de ações críticas.
- **Mensagem Obrigatória**: `"Você realmente quer remover essa imagem? Ao confirmar a remoção da imagem, ela será excluída e não poderá mais ser recuperada."`
- **Controle de Estado no Componente**:
  - `itemToDelete: DatasetItem | null` para rastrear qual imagem foi selecionada para exclusão.
  - `isDeleting: boolean` para evitar disparos múltiplos (duplo clique) e gerenciar feedback visual durante a requisição de rede.
  - `deleteError: string | null` para exibir mensagem de falha caso o backend recuse ou ocorra erro de rede.
- **Ações Disponíveis no Modal**:
  - **Cancelar**: Fecha o modal (`itemToDelete = null`, `deleteError = null`) sem efetuar requisições.
  - **Confirmar Exclusão**: Executa `DatasetServices.delete(itemToDelete.id)`, exibe estado de loading/desabilita botões e, ao obter sucesso, recarrega a tabela e fecha o modal.
- **Alternativas consideradas**:
  - *Usar window.confirm nativo do navegador*: Rejeitada por não permitir estilização profissional consistente com o design system (`AppModal`) e destoar da experiência do usuário exigida no sistema clínico.
  - *Excluir imediatamente com opção de Desfazer (Undo/Toast)*: Rejeitada pela exigência expressa do usuário de confirmar antes de remover devido à natureza irreversível da exclusão.

---

### Decisão 3: Posicionamento e Estilização do Botão na Tabela
- **Decisão**: Na coluna "Ações" da tabela em `src/app/admin/dataset/_list.tsx`, dispor os botões lado a lado em um container flex (`flex items-center justify-center gap-2`).
- **Botão Existente**: Botão de abrir/baixar imagem (`title="Abrir imagem"` / rótulo "Baixar").
- **Novo Botão**: Botão com ícone de lixeira (`ion-trash-a` ou `ion-android-delete`), cor de destaque semântico vermelho/destrutivo (ex: hover em tom avermelhado ou fundo com indicação de perigo), rótulo "Remover" e `title="Remover imagem"`.
- **Alternativas consideradas**:
  - *Menu dropdown de ações (três pontos)*: Rejeitada para manter acesso direto e visibilidade em 1 clique, conforme solicitado na descrição do requisito.

---

### Decisão 4: Atualização da Listagem Pós-Exclusão e Tratamento de Paginação
- **Decisão**: Ao concluir a exclusão com sucesso:
  1. Se a página atual possuir apenas 1 item e a página for superior a 1 (`page > 1 && items.length === 1`), decrementar a página e disparar `loadDataset(page - 1)`.
  2. Caso contrário, recarregar a página atual (`loadDataset(page)`).
- **Justificativa**: Evita que a tabela fique em estado vazio em uma página inexistente após remover o último registro daquela página.

---

## 3. Resumo de Diretrizes para o Plano

1. Atualizar contrato e implementar `DatasetServices.delete(id)`.
2. Adicionar o botão de remoção na coluna "Ações" de `_list.tsx` ao lado do botão de abrir imagem.
3. Implementar o modal com o aviso de confirmação textual exato solicitado pelo usuário.
4. Tratar estados de loading, desabilitação de botões e mensagens de erro e sucesso em pt-BR.
