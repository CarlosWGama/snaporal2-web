# Guia de Validação Rápida: Módulo Dataset

**Branch**: `001-list-registered-images` | **Data**: 2026-10-31

Este guia descreve os passos práticos para validação ponta a ponta do módulo **Dataset** após a implementação.

---

## Pré-requisitos

1. Dependências do projeto instaladas (`npm install` ou `yarn`).
2. Servidor de desenvolvimento em execução (`npm run dev`).
3. Usuário autenticado como administrador na aplicação (login efetuado com cookie `token` válido).
4. Backend acessível conforme configurado em `NEXT_PUBLIC_API_URL`.

---

## Cenários de Validação

### Cenário 1: Navegação via Menu Lateral
1. Acesse o painel administrativo em `http://localhost:3000/admin/dashboard`.
2. Localize no menu lateral esquerdo a opção **Dataset** (com ícone visual).
3. Clique em **Dataset**.
4. **Resultado Esperado**:
   - Redirecionamento para a rota `/admin/dataset`.
   - O título da página na aba deve ser `Dataset`.
   - O cabeçalho deve exibir `Dataset` dentro de `AppMainContainer`.

---

### Cenário 2: Renderização da Tabela de Imagens
1. Na tela `/admin/dataset`, aguarde o término do carregamento (`AppLoader`).
2. Observe a tabela com os registros carregados da API.
3. **Resultado Esperado**:
   - A tabela contém as colunas:
     - **Data Envio**: data formatada do campo `created_at`.
     - **Usuário**: `${user.name} (${user.email})`.
     - **Imagem**: miniatura da imagem (`image_url`).
     - **Tipo**: classificação clínica (ex: `câncer`).
     - **Confiança**: percentual formatado (ex: `96.84%`).
     - **Classificação**: badge "Positivo" ou "Negativo" conforme campo `positive`.
     - **Ações**: botão de download e visualização.

---

### Cenário 3: Filtragem de Registros
1. No bloco de filtros no topo da página:
   - Digite um termo no campo **Nome** (ex: `Profissional`).
   - Digite um email no campo **Email** (ex: `teste.com`).
   - Selecione um tipo no select **Tipo** (ex: `cancer`).
2. Clique no botão **Filtrar**.
3. **Resultado Esperado**:
   - O serviço dispara requisição `GET /dataset?page=1&name=Profissional&email=teste.com&type=cancer`.
   - A tabela atualiza exibindo apenas os registros correspondentes.

---

### Cenário 4: Download da Imagem Original
1. Na linha de qualquer imagem, clique no botão/ícone de **Download**.
2. **Resultado Esperado**:
   - O navegador inicia o download do arquivo de imagem apontado por `image_url`.
   - O arquivo é salvo localmente sem corrupção.

---

### Cenário 5: Paginação (10 Itens por Página)
1. Navegue até o rodapé da tabela.
2. Verifique os botões **Anterior** e **Próximo**.
3. Clique em **Próximo**.
4. **Resultado Esperado**:
   - A página atual avança para 2 (`page=2`).
   - A requisição `GET /dataset?page=2` é disparada.
   - Os novos 10 itens são renderizados.
