# Feature Specification: Remoção de Imagem do Dataset

**Feature Branch**: `002-delete-dataset-image`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "No modulo dataset, adicione um botão para remover a imagem em cada imagem recuperada na tabela, ao lado do botão de Abrir Imagem. Antes de remover, pergunte ao usuário se ele realmente quer remover e não terá como recuperar a imagem excluída."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ação de Exclusão com Diálogo de Confirmação Irreversível (Priority: P1)

Como administrador do sistema de prontuário eletrônico, ao inspecionar a tabela de imagens do dataset, desejo visualizar um botão dedicado para remover a imagem ao lado do botão de abrir imagem, para que eu possa iniciar o descarte de registros desnecessários ou incorretos com salvaguarda de confirmação prévia.

**Why this priority**: É a proteção essencial contra perda acidental de dados clínicos. A exibição do acionador no local correto e a exigência de confirmação com aviso explícito de irreversibilidade formam o núcleo da solicitação do usuário.

**Independent Test**: Pode ser testado acessando o módulo de dataset, identificando o botão de remoção em cada linha da tabela ao lado do botão de abrir imagem, clicando no botão e conferindo a abertura do diálogo de confirmação com o texto de advertência sobre a impossibilidade de recuperação.

**Acceptance Scenarios**:

1. **Given** que o administrador autenticado visualiza os registros de imagens na tabela do módulo de dataset, **When** inspecionar a coluna de ações de qualquer item, **Then** deve visualizar o botão de remover imagem posicionado ao lado do botão de abrir imagem.
2. **Given** que o administrador clica no botão de remover imagem de um registro, **When** a ação for disparada, **Then** o sistema deve exibir um diálogo ou modal de confirmação contendo a pergunta de confirmação e o alerta explícito de que a imagem será excluída definitivamente sem possibilidade de recuperação.

---

### User Story 2 - Confirmação e Efetivação da Remoção da Imagem (Priority: P1)

Como administrador, após revisar a advertência no diálogo de confirmação, desejo confirmar a remoção para que o registro seja excluído definitivamente do sistema e a tabela seja atualizada imediatamente sem a imagem removida.

**Why this priority**: Conclui o fluxo principal de exclusão, garantindo a sincronização dos dados e o feedback imediato para o administrador.

**Independent Test**: Pode ser testado confirmando a exclusão no diálogo, verificando a indicação visual de carregamento, o encerramento do diálogo, a exibição de mensagem de sucesso e a ausência do registro excluído na tabela recarregada.

**Acceptance Scenarios**:

1. **Given** que o diálogo de confirmação de remoção está aberto, **When** o administrador clicar no botão de confirmação definitiva, **Then** o sistema deve iniciar o processamento da exclusão, desabilitar ações repetidas e exibir indicador de carregamento.
2. **Given** que a exclusão foi processada com sucesso no backend, **When** o processamento terminar, **Then** o diálogo deve ser fechado, uma mensagem de sucesso em português do Brasil deve ser apresentada e a tabela deve atualizar sua listagem sem o item removido.

---

### User Story 3 - Cancelamento da Remoção (Priority: P2)

Como administrador, caso tenha acionado o botão de remoção por engano ou decida desistir do descarte, desejo cancelar a ação diretamente no diálogo de confirmação para retornar à listagem sem qualquer modificação no registro.

**Why this priority**: Garante tolerância a erros e controle do usuário, prevenindo ações destrutivas indesejadas.

**Independent Test**: Pode ser testado clicando no botão de remover de uma linha e, ao abrir o diálogo, acionando o botão de cancelamento ou fechamento, verificando que o diálogo é dispensado e a tabela mantém o registro inalterado.

**Acceptance Scenarios**:

1. **Given** que o diálogo de confirmação de remoção está visível na tela, **When** o administrador clicar no botão de cancelar ou dispensar o modal, **Then** o diálogo deve ser fechado imediatamente e nenhuma alteração deve ser efetuada no registro da imagem.

---

### Edge Cases

- **Falha de rede ou indisponibilidade do serviço durante a exclusão**: Se ocorrer falha de comunicação ou resposta de erro do servidor ao tentar excluir o registro, o sistema deve manter o diálogo fechado ou liberado para nova tentativa, apresentar notificação de erro compreensível em português e preservar o registro na tabela.
- **Exclusão concorrente do mesmo registro**: Caso outro usuário ou sessão já tenha removido a imagem previamente, o sistema deve informar que o item não foi encontrado ou já foi excluído e atualizar a listagem da tabela para refletir o estado atual.
- **Múltiplos cliques rápidos na confirmação**: Durante a execução da requisição de remoção, os botões de ação do diálogo devem permanecer desabilitados para evitar o disparo de requisições duplicadas.
- **Remoção do último item da página atual**: Se o item excluído for o único presente em uma página superior (ex: página 2), o sistema deve atualizar a paginação de forma consistente, retrocedendo para a página anterior se a atual ficar vazia.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um botão de remoção em cada linha da tabela do módulo de dataset, posicionado adjacente ao botão de abrir/baixar imagem.
- **FR-002**: O sistema DEVE interceptar o clique de remoção e exibir um diálogo/modal de confirmação antes de disparar qualquer requisição de exclusão ao backend.
- **FR-003**: O diálogo de confirmação DEVE alertar explicitamente o usuário em português do Brasil com texto claro informando que a imagem será removida e não haverá possibilidade de recuperação posterior.
- **FR-004**: O diálogo de confirmação DEVE conter um botão para confirmar a exclusão e um botão para cancelar a operação.
- **FR-005**: Ao clicar no botão de cancelamento, o sistema DEVE fechar o diálogo de confirmação mantendo todos os dados e o estado da tabela inalterados.
- **FR-006**: Ao confirmar a remoção, o sistema DEVE desabilitar as interações de confirmação e apresentar estado de carregamento até a conclusão da operação.
- **FR-007**: Após a exclusão bem-sucedida, o sistema DEVE fechar o diálogo de confirmação, apresentar notificação visual de sucesso em português do Brasil e atualizar a listagem da tabela refletindo a remoção do item.
- **FR-008**: Em caso de falha no processo de exclusão, o sistema DEVE apresentar mensagem de erro clara em português do Brasil sem corromper a interface ou o estado dos dados exibidos.
- **FR-009**: A funcionalidade de remoção DEVE ser restrita exclusivamente a administradores autenticados.

### Key Entities *(include if feature involves data)*

- **Imagem do Dataset**: Registro clínico contendo a referência do arquivo de imagem, dados do usuário responsável, tipo de patologia/exame, índice de confiança, classificação diagnóstica e identificador exclusivo utilizado para a operação de exclusão.
- **Confirmação de Exclusão**: Estado de controle de interface com o usuário que armazena a referência do item selecionado para remoção e gerencia o diálogo de aviso de irreversibilidade antes de enviar a ordem de deleção ao backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das solicitações de remoção de imagens solicitam confirmação prévia com mensagem clara de irreversibilidade antes de disparar a exclusão.
- **SC-002**: A exclusão e a atualização da tabela de registros são concluídas em menos de 2 segundos sob condições normais de conectividade.
- **SC-003**: 100% dos cancelamentos acionados no diálogo fecham a visualização sem alterar os dados cadastrados ou disparar requisições de rede destrutivas.
- **SC-004**: Zero ocorrências de exclusões acidentais disparadas por clique único ou sem diálogo de confirmação.

## Assumptions

- O backend disponibiliza ou suportará uma rota ou método para exclusão do registro de imagem do dataset com base no seu identificador.
- A exclusão é uma operação definitiva (hard delete ou desativação permanente), justificando a exigência de confirmação irreversível informada ao usuário.
- O botão de "Abrir Imagem" citado na descrição corresponde à ação de visualização/download de imagem já existente na coluna de ações da tabela do dataset.
- Apenas administradores com perfil válido e sessão autenticada têm acesso ao módulo de dataset e à funcionalidade de exclusão.
