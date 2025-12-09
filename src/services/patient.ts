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