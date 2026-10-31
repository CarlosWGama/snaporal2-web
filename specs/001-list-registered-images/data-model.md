# Modelo de Dados: Módulo Dataset

**Branch**: `001-list-registered-images` | **Data**: 2026-10-31

Este documento define os tipos, entidades e regras de validação para o módulo de listagem e gerenciamento de imagens do Dataset.

---

## Entidades e Interfaces TypeScript

### 1. Entidade Usuário Resumido (`DatasetUser`)
Representa os dados do usuário/profissional vinculado ao registro da imagem clínica.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | Sim | Nome completo do usuário/profissional que enviou o exame |
| `email` | `string` | Sim | Endereço de e-mail do usuário |

### 2. Entidade Registro de Imagem do Dataset (`DatasetItem`)
Representa cada item retornado pelo backend contendo a imagem, metadados da análise e informações do autor.

| Campo | Tipo | Obrigatório | Descrição | Regras de Validação |
|---|---|---|---|---|
| `image_url` | `string` | Sim | URL pública ou assinada para acesso e download da imagem | Deve ser uma URL válida (HTTP/HTTPS) |
| `type` | `string` | Sim | Categoria da patologia/imagem clínica | Ex: `'câncer'`, `'cancer'`, `'qa'`, `'eritroplasia'`, `'leucoplasia'` |
| `positive` | `boolean` | Sim | Classificação diagnóstica se o resultado é positivo ou negativo | Booleano (`true` para positivo, `false` para negativo) |
| `assurance` | `number` | Sim | Índice numérico de confiança da análise | Valor numérico entre 0 e 100 |
| `created_at` | `string` | Sim | Data e hora de criação/envio | String formatada (ex: `DD/MM/YYYY HH:mm:ss`) |
| `user` | `DatasetUser` | Sim | Objeto com as informações do usuário | Objeto contendo `name` e `email` |

### 3. Filtros de Consulta (`DatasetFilter`)
Parâmetros enviados na requisição para filtrar os resultados retornados.

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `page` | `number` | `1` | Índice da página atual para paginação |
| `name` | `string` (opcional) | `""` | Filtro parcial por nome do usuário |
| `email` | `string` (opcional) | `""` | Filtro parcial por email do usuário |
| `type` | `'cancer' \| 'qa' \| 'eritroplasia' \| 'leucoplasia'` (opcional) | `""` | Filtro exato por categoria clínica |

---

## Transformações e Regras de Apresentação (UI)

1. **Confiança**:
   - Entrada: `item.assurance` (ex: `96.84`).
   - Saída na UI: `${item.assurance.toFixed(2)}%` (ex: `96.84%`). Se nulo ou inválido, exibir `"-"`.

2. **Classificação**:
   - Entrada: `item.positive` (booleano).
   - Se `true`: Texto "Positivo" estilizado com badge verde/alerta.
   - Se `false`: Texto "Negativo" estilizado com badge cinza/informativo.

3. **Usuário**:
   - Entrada: `item.user`.
   - Saída na UI: `${item.user?.name || 'Sem nome'} (${item.user?.email || 'Sem email'})`.

4. **Data de Envio**:
   - Entrada: `item.created_at`.
   - Saída na UI: Exibição direta da string já formatada ou formatação com moment/date-fns caso venha em ISO.
