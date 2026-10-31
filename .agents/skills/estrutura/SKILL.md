---
name: modules-create
description: Guia de como criar e usar os modulos do projeto
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# ESTRUTURA 


## GERAL

### APP ROUTER
Todas as telas (layout) devem ser criado no nextjs dentro da pasta:
/src/app/admin -> telas que o usuário precisa estar autenticado como admin
/src/app -> telas que o usuário não precisa estar autenticado como admin

### PAGES
Sempre que precisar criar uma estrutura de uma view, criar ela dentro da pasta app, conforme o exemplo abaixo:
```
/src/app
  /nome-modulo -> Página que o usuário *não precisa* estar autenticado
    page.tsx        -> Layout da página 
    _nome-component.tsx  -> Componente que faz parte da página
  /admin
    /nome-modulo2 -> Página que o usuário *precisa* estar autenticado
      /submodulo -> uma subopção do módulo
        page.tsx  -> tela do submodulo
      page.tsx        -> Layout da página (Sempre usar o nome page.tsx)
      _nome-component.tsx  -> Componente que faz parte da página
    /nome-modulo3 -> Página que o usuário *precisa* estar autenticado
      page.tsx        -> Layout da página (Sempre usar o nome page.tsx)
      _nome-component.tsx  -> Componente que faz parte da página
```
---

Ao adicionar um novo modulo no admin, também adicione no componente `/src/themes/components/menu.tsx` um link apontando para acessar a tela inicial do componente, como no exemplo abaixo:
```tsx
{/* OPÇÕES */}
<div className="pl-[30px] mt-[30px] flex-1">
    <AppMenuItem title="Dashboard" icon="grid" url="/admin/dashboard" />
    <AppMenuItem title="Usuários" icon="ios-people" url="/admin/usuarios" />
    <AppMenuItem title="Consultas" icon="calendar" url="/admin/consultas" />
    <AppMenuItem title="Pacientes" icon="clipboard" url="/admin/pacientes" />
    <AppMenuItem title="{NOVO MODULO}" icon="clipboard" url="/admin/{novo-modulo}" />
</div>
```

### Temas
As informações e componentes que são compartilhado entre várias telas, precisam estar dentro da pasta /src/app/themes/components

### ADMIN

Nas telas de admin, o layout principal deve ser o component "AppMainContainer", conforme o exemplo abaixo:
```ts
import { AppMainContainer } from "@/themes/components";
import ConsultationList from "./_list";

export const metadata = {
    title: 'Título da página na aba do navegador'
}
// ==========================================================
export default function NomeModuloPage() {

    // ==========================================================
    return (
        <AppMainContainer title="{título da página}">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[20px]">{Título da página}</h1>
            </div>

            {/*... restante do código ...*/}
        </AppMainContainer>
    )
}
```

### API
Para se conectar com api deve ser criado um arquivo que manipula o recurso na pasta /src/services/{nome-recurso}.ts

A conexão será feita através da biblitoeca do Axios, disponível no arquivo /src/services/api.ts.

Ao criar um novo service usar a estrutura base como o exemplo abaixo:
```ts
import Cookies from 'js-cookie';
import api from './api';

/**
 * SERVICES DE GERENCIAMENTO DE USUÁRIOS
 */
const PatientServices = {

    /**
     * Retorna todos os usuários do sistema
     * @returns 
     */
    getAll: async (page: number = 1, filter: any = {}): Promise<{ success: boolean, patients?: any[], extra?: any }> => {
        try {
            const params = new URLSearchParams(filter);
            console.log(`/patients?page=${page}&${params.toString()}`);
            const response = await api.get(`/patients?page=${page}&${params.toString()}`);
            console.log(response);
            return { success: true, patients: response.data.items, extra: response.data };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Retorna dados de um unico usuário
     * @returns 
     */
    getById: async (id: number): Promise<{ success: boolean, patient: any }> => {
        try {
            const response = await api.get(`/patients/${id}`);
            console.log(response);
            return { success: true, patient: response.data };
        } catch (erro) {
            return { success: false, patient: null };
        }
    },

    /**
     * Cria um usuário
     * @param patient 
     * @returns 
     */
    create: async (patient: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.post(`/patients`, patient);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Atualiza um usuário
     * @param patient 
     * @returns 
     */
    update: async (patient: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.put(`/patients/${patient.id}`, patient);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Remove um usuário
     * @param patient 
     * @returns 
     */
    delete: async (id: number): Promise<{ success: boolean }> => {
        try {
            await api.delete(`/patients/${id}`);
            return { success: true };
        } catch (erro: any) {
            return { success: false };
        }
    }


}

export default PatientServices;
```
