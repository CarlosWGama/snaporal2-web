<!--
Sync Impact Report:
- Version change: Unversioned Template -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Controle de Acesso Administrativo Estrito (Strict Admin RBAC)
  - [PRINCIPLE_2_NAME] -> II. Arquitetura Next.js 15 com App Router
  - [PRINCIPLE_3_NAME] -> III. Camada Centralizada de Serviços e API via Axios (src/services/api.ts)
  - [PRINCIPLE_4_NAME] -> IV. Experiência do Usuário e Rotas em Português do Brasil (pt-BR)
  - [PRINCIPLE_5_NAME] -> V. Planejamento e Tarefas do Spec Kit em Português
- Added sections:
  - Restrições Tecnológicas e de Segurança (Technology & Security Constraints)
  - Fluxo de Desenvolvimento e Padrões de Qualidade (Development Workflow & Quality Standards)
- Removed sections:
  - Nenhuma (substituição dos slots do scaffold inicial)
- Follow-up TODOs:
  - Nenhum
-->

# SnapOral Admin Constitution

## Core Principles

### I. Controle de Acesso Administrativo Estrito (Strict Admin RBAC)
O presente projeto é um gerenciador administrativo de um sistema de prontuário eletrônico. O acesso ao sistema DEVE ser restrito exclusivamente a pessoas autenticadas com perfil de administrador. Qualquer rota ou recurso restrito DEVE validar o estado de autenticação e a permissão administrativa antes de autorizar a renderização ou acesso aos dados, redirecionando usuários não autorizados para o fluxo de autenticação.

### II. Arquitetura Next.js 15 com App Router
O sistema DEVE ser desenvolvido estritamente sobre o Next.js 15 utilizando o App Router (`src/app`). Componentes e páginas DEVEM adotar a correta separação entre Server Components e Client Components (`'use client'`). A organização de diretórios e grupos de rotas (como `(login)` e `admin`) DEVE garantir layouts previsíveis, carregamento otimizado e manutenibilidade estrutural.

### III. Camada Centralizada de Serviços e API via Axios
Toda comunicação com o backend DEVE ser executada exclusivamente através dos módulos localizados em `src/services`, utilizando a instância centralizada de Axios configurada em `src/services/api.ts`. É PROIBIDO instanciar clientes HTTP isolados ou realizar chamadas diretas de requisição de rede em páginas ou componentes de apresentação. Interceptadores, injeção de tokens de autenticação (Bearer Token) e tratamento de erros de transporte DEVEM ser governados centralmente na camada de serviços.

### IV. Experiência do Usuário e Rotas em Português do Brasil (pt-BR)
Todas as rotas visíveis no navegador, interfaces com o usuário, rótulos, formulários, alertas, notificações e mensagens de erro exibidas ao usuário final DEVEM ser escritas em português do Brasil (pt-BR). O código-fonte (nomes de funções, variáveis, classes, tipos e documentação técnica interna) PODE ser escrito em inglês, mantendo a consistência do ecossistema de desenvolvimento, desde que nenhuma string em inglês seja exposta na experiência do usuário.

### V. Planejamento e Tarefas do Spec Kit em Português
Ao criar especificações, planejamentos de arquitetura, checklists e listas de tarefas utilizando as ferramentas do Spec Kit (`.specify/`), todo o conteúdo descritivo, objetivos, critérios de aceitação e instruções DEVEM ser redigidos em português. Esse princípio garante que o processo de engenharia e os requisitos de negócio permaneçam perfeitamente alinhados ao domínio do prontuário eletrônico e acessíveis a toda a equipe.

## Restrições Tecnológicas e de Segurança

O sistema opera com dados sensíveis de prontuário eletrônico e administração clínica, exigindo salvaguardas rigorosas:
- **Stack Tecnológico**: Next.js 15, React 19, TailwindCSS, Axios para transporte HTTP, Formik e Yup para formulários e validações, e `js-cookie` para persistência segura de sessão.
- **Proteção de Dados**: Dados sensíveis de pacientes e prontuários NUNCA devem ser registrados em logs de console no ambiente de produção nem expostos em parâmetros de URL sem proteção.
- **Sessão e Credenciais**: O token de acesso administrativo DEVE ser injetado nas requisições autorizadas via cabeçalho `Authorization: Bearer <token>` através do interceptor de `src/services/api.ts`.

## Fluxo de Desenvolvimento e Padrões de Qualidade

- **Validação Estática**: Todo o código DEVE compilar sem erros de TypeScript e respeitar as regras do ESLint configuradas no projeto.
- **Separação de Responsabilidades**: A camada de visualização (UI) DEVE ser desacoplada da lógica de acesso a dados. Modificações em contratos de API devem refletir primeiramente na camada `src/services`.
- **Rastreabilidade por Spec Kit**: Novas funcionalidades ou alterações estruturais DEVEM iniciar pelo ciclo de especificação e planejamento antes da implementação, mantendo as tarefas devidamente rastreadas em `.specify/`.

## Governance

A Constituição do Projeto SnapOral Admin é a autoridade máxima de governança arquitetural e de desenvolvimento. Nenhuma alteração de código ou prática informal pode violar os princípios aqui estabelecidos.

- **Processo de Emenda**: Alterações nesta constituição requerem registro formal de versão, justificativa fundamentada e atualização deste documento.
- **Versionamento Semântico**:
  - **MAJOR**: Modificação, exclusão ou redefinição incompatível de princípios centrais existentes.
  - **MINOR**: Adição de novos princípios, seções estruturais ou expansão material de diretrizes de governança.
  - **PATCH**: Correções de grafia, refinamentos textuais, esclarecimentos não semânticos e pequenos ajustes editoriais.
- **Auditoria e Conformidade**: Todas as revisões de código (PRs) e etapas de implementação DEVEM verificar ativamente a conformidade com estes princípios.

**Version**: 1.0.0 | **Ratified**: 2026-10-31 | **Last Amended**: 2026-10-31
