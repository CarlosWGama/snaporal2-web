# Contrato de API: Exclusão de Imagem do Dataset

**Endpoint**: `/dataset/{id}`  
**Método HTTP**: `DELETE`  
**Autenticação**: Obrigatória (`Bearer <token>` no header `Authorization`)

---

## 1. Parâmetros de Rota

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Sim | Identificador numérico único do registro de imagem no dataset |

---

## 2. Cabeçalhos da Requisição

```http
DELETE /dataset/123 HTTP/1.1
Host: api.snaporal.com.br
Authorization: Bearer <JWT_ADMIN_TOKEN>
Content-Type: application/json
```

---

## 3. Respostas da API

### 3.1. Sucesso (`200 OK` ou `204 No Content`)

#### Status `200 OK`:
```json
{
  "success": true,
  "message": "Imagem removida com sucesso do dataset."
}
```

#### Status `204 No Content`:
Corpo vazio.

---

### 3.2. Erros Comuns

#### `401 Unauthorized` (Token ausente ou expirado):
```json
{
  "message": "Não autorizado."
}
```

#### `404 Not Found` (Registro não encontrado ou já removido):
```json
{
  "message": "Registro de imagem não encontrado no dataset."
}
```

#### `500 Internal Server Error` (Falha interna ao excluir arquivo ou registro):
```json
{
  "message": "Erro interno ao processar a exclusão da imagem."
}
```
