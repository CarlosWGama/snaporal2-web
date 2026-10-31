# Guia de Validação Rápida: Remoção de Imagem do Dataset

**Feature**: `002-delete-dataset-image`  
**Data**: 2026-10-31  
**Status**: Concluído

## 1. Pré-requisitos

1. Aplicação Next.js em execução (`npm run dev`) ou pronta para teste estático (`npm run build` / `npx tsc --noEmit`).
2. Usuário administrador autenticado no sistema (token salvo nos cookies do navegador).
3. Backend acessível configurado na variável de ambiente `NEXT_PUBLIC_API_URL` com pelo menos uma imagem cadastrada no dataset.

---

## 2. Cenários de Teste Ponta a Ponta

### Cenário 1: Visualização do Botão de Remoção
1. Acesse o painel administrativo na rota `/admin/dataset`.
2. Aguarde o carregamento da tabela com as imagens cadastradas.
3. Observe a coluna **Ações** de qualquer registro.
4. **Resultado Esperado**: Ao lado do botão de abrir/baixar imagem, deve existir um botão de remoção identificado ("Remover").

---

### Cenário 2: Cancelamento da Remoção
1. Clique no botão **Remover** de uma das imagens da tabela.
2. O modal de confirmação deve ser aberto com o título de confirmação e a mensagem:
   > *"Você realmente quer remover essa imagem? Ao confirmar a remoção da imagem, ela será excluída e não poderá mais ser recuperada."*
3. Clique no botão de cancelar ou dispensar o modal.
4. **Resultado Esperado**: O modal é fechado e a imagem permanece intacta e visível na tabela, sem envio de requisições de remoção ao servidor.

---

### Cenário 3: Confirmação e Exclusão com Sucesso
1. Clique no botão **Remover** da imagem desejada.
2. No modal aberto, clique no botão de confirmar remoção.
3. Observe a desativação dos controles e a indicação de processamento durante a requisição `DELETE /dataset/{id}`.
4. **Resultado Esperado**:
   - A requisição é enviada com o header `Authorization: Bearer <token>`.
   - O modal é fechado após a resposta positiva.
   - A tabela recarrega e o registro excluído não aparece mais na listagem.

---

### Cenário 4: Tratamento de Erro na Exclusão
1. Simule uma falha de conexão ou resposta de erro do servidor (ex: status 500 ou 404).
2. Tente confirmar a exclusão no modal.
3. **Resultado Esperado**:
   - A interface exibe a mensagem de erro retornada pela API ou o fallback *"Falha ao excluir imagem do dataset."*.
   - A tabela não sofre remoção indevida e o usuário é informado em português.

---

## 3. Validação Estática de Código

```bash
# Validação de tipagem TypeScript
npx tsc --noEmit

# Validação de conformidade com ESLint
npm run lint
```
