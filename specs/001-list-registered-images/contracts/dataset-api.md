# Contrato de API: Endpoint /dataset

**Método**: `GET`  
**Caminho**: `/dataset`  
**Autenticação**: `Bearer <token>` obrigatório (gerenciado pelo cookie via interceptor do Axios)

---

## Parâmetros de Consulta (Query Parameters)

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `page` | Inteiro | Não | `1` | Número da página para paginação |
| `name` | String | Não | - | Filtro parcial pelo nome do usuário |
| `email` | String | Não | - | Filtro parcial pelo email do usuário |
| `type` | String | Não | - | Filtro pelo tipo clínico: `cancer`, `qa`, `eritroplasia`, `leucoplasia` |

### Exemplo de URL de Requisição
```http
GET /dataset?page=1&email=profissional@teste.com&name=Profissional&type=cancer HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer <token>
Accept: application/json
```

---

## Resposta de Sucesso (`200 OK`)

**Content-Type**: `application/json`

```json
[
  {
    "image_url": "http://localhost/storage/scan/3_lJjhhPTBN7vZdOmFyLSAXWc43o62uAUt.jpg",
    "type": "câncer",
    "positive": false,
    "assurance": 96.84,
    "created_at": "31/10/2026 10:50:30",
    "user": {
      "name": "Profissional",
      "email": "profissional@teste.com"
    }
  }
]
```

---

## Códigos de Retorno Esperados

| Status Code | Significado | Descrição |
|---|---|---|
| `200 OK` | Sucesso | Retorna array de registros (vazio `[]` quando não houver correspondência) |
| `401 Unauthorized` | Não Autenticado | Token ausente, inválido ou expirado |
| `403 Forbidden` | Não Autorizado | Usuário autenticado não possui privilégios de administrador |
| `500 Internal Server Error` | Erro do Servidor | Falha interna no backend |
