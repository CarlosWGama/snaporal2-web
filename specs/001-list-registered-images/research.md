# Pesquisa Técnica e Decisões de Arquitetura: Módulo Dataset

**Branch**: `001-list-registered-images` | **Data**: 2026-10-31

## Contexto e Objetivos

O módulo **Dataset** tem como objetivo fornecer ao administrador a listagem, auditoria, filtragem e download das imagens clínicas registradas no sistema de prontuário eletrônico. Esta pesquisa consolida as decisões técnicas em total conformidade com a Constituição do Projeto SnapOral Admin.

---

## Decisões Técnicas

### 1. Camada de Serviço Centralizada (`/src/services/dataset.ts`)

- **Decisão**: Criar o serviço `DatasetServices` em `src/services/dataset.ts`, consumindo exclusivamente a instância Axios central de `src/services/api.ts`.
- **Assinatura da Função**:
  ```typescript
  getAll: (
    page: number = 1,
    filters?: {
      name?: string;
      email?: string;
      type?: 'cancer' | 'qa' | 'eritroplasia' | 'leucoplasia';
    }
  ) => Promise<{ success: boolean; data?: DatasetItem[]; error?: string }>
  ```
- **Mapeamento de Parâmetros**:
  - `page`: Número da página (padrão 1).
  - `name`: Nome do usuário para filtro (opcional).
  - `email`: E-mail do usuário para filtro (opcional).
  - `type`: Categoria da patologia/imagem clínica (`cancer`, `qa`, `eritroplasia`, `leucoplasia`).
- **Endpoint Alvo**: `GET /dataset`
- **Rationale**: Alinhado com o Princípio III da Constituição (centralização de serviços via Axios com interceptors e autenticação via Bearer token em Cookies).
- **Alternativas Rejeitadas**:
  - Chamadas diretas de `fetch` em componentes React: Violaria o Princípio III da Constituição.

### 2. Estrutura de Telas no Next.js 15 App Router (`/src/app/admin/dataset`)

- **Decisão**: Estruturar a funcionalidade sob a rota administrativa `/src/app/admin/dataset` com dois arquivos:
  - `page.tsx`: Server Component exportando os metadados da página (`title: 'Dataset'`) e renderizando o container padrão `AppMainContainer` com título descritivo.
  - `_list.tsx`: Client Component (`'use client'`) encarregado do estado local dos filtros (nome, email, tipo), paginação (10 itens/página), tabela de dados, modal de pré-visualização e mecanismo de download.
- **Rationale**: Segue o Princípio II (App Router) e as convenções consolidadas no projeto em `src/app/admin/usuarios` e no skill `modules-create`.
- **Alternativas Rejeitadas**:
  - Unificar tudo em um único arquivo `page.tsx`: Dificulta separação de Server Components e Client Components no Next.js 15.

### 3. Integração ao Menu Administrativo (`src/themes/components/menu.tsx`)

- **Decisão**: Inserir uma nova entrada no menu lateral:
  ```tsx
  <AppMenuItem title="Dataset" icon="image" url="/admin/dataset" />
  ```
- **Rationale**: Garante acesso imediato aos administradores autenticados logo após o item "Pacientes".
- **Alternativas Rejeitadas**:
  - Submenu ou acesso secundário: O usuário solicitou explicitamente adicionar o campo "Dataset" no menu do administrador.

### 4. Apresentação e Formatação das Colunas da Tabela

- **Data Envio**: Exibe a data de submissão do exame obtida do campo `created_at`.
- **Usuário**: Exibição composta no formato `{user.name} ({user.email})`. Caso ausente ou incompleto, aplicar fallback seguro.
- **Imagem**: Renderização de miniatura (`<img>`) com dimensões controladas (ex: 60x60 com cantos arredondados) e clique para abrir modal com visualização ampliada.
- **Tipo**: Exibição da categoria clínica baseada no campo `type` (ex: "câncer", "qa", etc.).
- **Confiança**: Formatação do campo numérico `assurance` como porcentagem legível (`96.84%`).
- **Classificação**: Mapeamento booleano do campo `positive`:
  - `true` → Badge "Positivo" (destaque visual afirmativo).
  - `false` → Badge "Negativo" (destaque neutro/informativo).
- **Ação de Baixar**: Botão/ícone de download direto acionando o download da `image_url` mantendo o nome do arquivo.
- **Rationale**: Cumpre integralmente os requisitos funcionais solicitados sem expor termos em inglês desnecessários ao usuário final.

### 5. Paginação e Filtros

- **Paginação**: Controle por blocos de 10 itens por página através do parâmetro `page`, com botões "Anterior" e "Próximo".
- **Filtros**:
  - Campo "Nome" (`name="name"`, `AppInput`)
  - Campo "Email" (`name="email"`, `AppInput`)
  - Campo "Tipo" (`name="type"`, `AppSelect`) com opções:
    - `""` (Todos)
    - `"cancer"` (Câncer)
    - `"qa"` (QA)
    - `"eritroplasia"` (Eritroplasia)
    - `"leucoplasia"` (Leucoplasia)
  - Botão "Filtrar" que recarrega a busca a partir da página 1.
- **Rationale**: Padrão exatamente correspondente aos inputs especificados pelo usuário e consistente com o resto do painel administrativo.
