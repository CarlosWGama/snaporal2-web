# Implementation Plan: Remoção de Imagem do Dataset

**Branch**: `002-delete-dataset-image` | **Data**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Especificação da funcionalidade em `specs/002-delete-dataset-image/spec.md` e instruções técnicas do usuário para o serviço `DatasetServices.delete(id)` e interface `_list.tsx`.

---

## Summary

Implementação da funcionalidade de remoção definitiva de imagens cadastradas no módulo **Dataset**. O plano contempla a adição do método `delete(id: number)` na camada de serviço `src/services/dataset.ts` consumindo a rota `DELETE /dataset/{id}` via cliente Axios autenticado, e a inclusão de um botão de remoção na coluna "Ações" da tabela em `src/app/admin/dataset/_list.tsx`, acionando um modal de confirmação com a mensagem mandatória de irreversibilidade antes de submeter a exclusão.

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.1.0  
**Primary Dependencies**: Next.js 15.5.5 (App Router), Axios 1.13.2, TailwindCSS 4, js-cookie  
**Storage**: N/A (Consumo de API REST externa; persistência de sessão e token de autenticação via Cookies)  
**Testing**: Checagem de tipagem com TypeScript (`tsc --noEmit`), validação com ESLint e verificação ponta a ponta guiada por `quickstart.md`  
**Target Platform**: Web (Navegadores desktop e responsivo para administração)  
**Project Type**: Web Application (Painel de Administração Clínica)  
**Performance Goals**: Exclusão e atualização visual da listagem refletidas em menos de 2 segundos sob conexão estável  
**Constraints**: Acesso restrito a administradores autenticados; confirmação obrigatória antes de qualquer chamada destrutiva; mensagens e textos 100% em pt-BR; comunicação via `src/services/api.ts`  
**Scale/Scope**: Atualização em 1 arquivo de serviço (`src/services/dataset.ts`) e 1 Client Component de apresentação (`src/app/admin/dataset/_list.tsx`)  

---

## Constitution Check

*GATE: Validação inicial pré-pesquisa e reavaliação pós-design.*

- **I. Controle de Acesso Administrativo Estrito (Strict Admin RBAC)**: **APROVADO**. A funcionalidade está contida sob `/admin/dataset`, acessível exclusivamente a administradores autenticados. O token de sessão é injetado via Cookie/Bearer Token no cabeçalho `Authorization` pelo interceptor do Axios.
- **II. Arquitetura Next.js 15 com App Router**: **APROVADO**. Mantém a arquitetura do App Router com o componente de listagem isolado como Client Component interativo (`'use client'`).
- **III. Camada Centralizada de Serviços e API via Axios**: **APROVADO**. O componente `_list.tsx` não realiza chamadas diretas de rede nem instancia clientes HTTP avulsos; invoca unicamente `DatasetServices.delete(id)` definido em `src/services/dataset.ts`.
- **IV. Experiência do Usuário e Rotas em Português do Brasil (pt-BR)**: **APROVADO**. A mensagem de confirmação do modal (*"Você realmente quer remover essa imagem? Ao confirmar a remoção da imagem, ela será excluída e não poderá mais ser recuperada."*), os botões e todos os feedbacks de erro e sucesso estão rigorosamente em pt-BR.
- **V. Planejamento e Tarefas do Spec Kit em Português**: **APROVADO**. Todos os artefatos de planejamento (`plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) estão redigidos em português.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-delete-dataset-image/
├── spec.md                       # Especificação de requisitos funcionais e critérios
├── plan.md                       # Este plano de implementação técnica
├── research.md                   # Decisões arquiteturais e justificativas técnicas
├── data-model.md                 # Entidades, tipos TypeScript e estados de UI
├── quickstart.md                 # Guia prático de validação dos cenários
├── contracts/
│   ├── dataset-delete-api.json   # Schema JSON de validação do contrato da rota DELETE
│   └── dataset-delete-api.md     # Documentação legível do contrato do endpoint
└── checklists/
    └── requirements.md           # Checklist de conformidade da especificação
```

### Source Code (repository root)

```text
src/
├── services/
│   ├── api.ts              # Cliente Axios com interceptor de autenticação Bearer Token
│   └── dataset.ts          # [MODIFICADO] Adição do método delete(id: number)
└── app/
    └── admin/
        └── dataset/
            ├── page.tsx    # Server Component da página
            └── _list.tsx   # [MODIFICADO] Inclusão do botão de remover, modal de confirmação e disparo do serviço
```

**Structure Decision**: Reutilização da estrutura desacoplada existente do módulo Dataset, adicionando o novo contrato de deleção no serviço `src/services/dataset.ts` e conectando o fluxo de confirmação e exclusão diretamente no componente de apresentação `_list.tsx`.

---

## Complexity Tracking

*Nenhuma violação ou complexidade desnecessária identificada. O design atende rigorosamente a todas as diretrizes constitucionais e aos requisitos de usuário.*
