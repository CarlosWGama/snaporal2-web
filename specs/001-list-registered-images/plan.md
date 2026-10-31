# Implementation Plan: Módulo Dataset de Imagens Cadastradas

**Branch**: `001-list-registered-images` | **Data**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Especificação da funcionalidade em `specs/001-list-registered-images/spec.md` e instruções técnicas do usuário para o serviço e módulo Dataset.

---

## Summary

Implementação do módulo administrativo **Dataset**, composto pela criação do serviço de comunicação `src/services/dataset.ts` com Axios centralizado e da interface de usuário sob a rota `src/app/admin/dataset`. A interface disponibiliza uma tabela de auditoria e listagem de imagens com paginação de 10 em 10 itens, filtros por nome, e-mail e tipo patológico, e ação de download direto da imagem cadastrada, além da inclusão do atalho no menu lateral administrativo.

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.1.0  
**Primary Dependencies**: Next.js 15.5.5 (App Router), Axios 1.13.2, TailwindCSS 4, js-cookie  
**Storage**: N/A (Consumo de API REST externa; persistência de sessão e token de autenticação via Cookies)  
**Testing**: Checagem de tipos com TypeScript (`tsc --noEmit`), validação de lint com ESLint e verificação ponta a ponta guiada por `quickstart.md`  
**Target Platform**: Web (Navegadores desktop e responsivo para administração)  
**Project Type**: Web Application (Painel de Administração Clínica)  
**Performance Goals**: Carregamento da listagem de imagens e renderização da tabela em menos de 2 segundos  
**Constraints**: Acesso restrito a administradores autenticados; interface e mensagens 100% em pt-BR; chamadas de rede estritamente via `src/services/api.ts`  
**Scale/Scope**: 1 novo arquivo de serviço (`src/services/dataset.ts`), 1 nova rota administrativa (`src/app/admin/dataset/page.tsx` + `_list.tsx`), e atualização do menu de navegação (`src/themes/components/menu.tsx`)  

---

## Constitution Check

*GATE: Validação inicial pré-pesquisa e reavaliação pós-design.*

- **I. Controle de Acesso Administrativo Estrito (Strict Admin RBAC)**: **APROVADO**. A rota reside sob `/admin/dataset`, herdando a proteção de layout e sessão administrativa. O token é injetado via Cookie/Bearer Token pelo interceptor do Axios.
- **II. Arquitetura Next.js 15 com App Router**: **APROVADO**. Separação adequada entre Server Component (`page.tsx`) e Client Component interativo (`_list.tsx` com `'use client'`).
- **III. Camada Centralizada de Serviços e API via Axios**: **APROVADO**. Nenhuma chamada direta de `fetch` ou instância avulsa de HTTP. Todas as requisições passam por `src/services/dataset.ts` que consome `src/services/api.ts`.
- **IV. Experiência do Usuário e Rotas em Português do Brasil (pt-BR)**: **APROVADO**. Rota, colunas, labels dos filtros, botões e mensagens operacionais redigidas em pt-BR.
- **V. Planejamento e Tarefas do Spec Kit em Português**: **APROVADO**. Todos os artefatos de planejamento (`plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) estão redigidos em português.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-list-registered-images/
├── spec.md              # Especificação de requisitos funcionais e critérios
├── plan.md              # Este plano de implementação técnica
├── research.md          # Decisões arquiteturais e justificativas técnicas
├── data-model.md        # Entidades, tipos TypeScript e regras de transformação
├── quickstart.md        # Guia prático de validação dos cenários
├── contracts/
│   ├── dataset-api.json # Schema JSON de validação do contrato da API
│   └── dataset-api.md   # Documentação legível do contrato de endpoints
└── checklists/
    └── requirements.md  # Checklist de conformidade da especificação
```

### Source Code (repository root)

```text
src/
├── services/
│   ├── api.ts              # Instância centralizada do Axios com interceptor de autenticação
│   └── dataset.ts          # [NOVO] Serviço getAll com filtros (name, email, type) e paginação
├── themes/
│   └── components/
│       └── menu.tsx        # [MODIFICADO] Inclusão do item "Dataset" no menu do administrador
└── app/
    └── admin/
        └── dataset/
            ├── page.tsx    # [NOVO] Server Component com AppMainContainer e metadados
            └── _list.tsx   # [NOVO] Client Component da tabela, paginação, filtros e download
```

**Structure Decision**: Adoção do padrão oficial de módulos administrativos do projeto (conforme documentado na skill `modules-create` e observado em `src/app/admin/usuarios`), desacoplando a camada de dados em `src/services/dataset.ts` e a camada de visualização em `src/app/admin/dataset`.

---

## Complexity Tracking

*Nenhuma violação ou complexidade desnecessária identificada. O design cumpre com exatidão as regras da Constituição.*
