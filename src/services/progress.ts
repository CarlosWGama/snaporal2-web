import api from './api';

/**
 * SERVICES DE GERENCIAMENTO DE USUÁRIOS
 */
const ProgressServices = {

    /**
     * Retorna todos os usuários do sistema
     * @returns 
     */
    getAll: async (patientID: number): Promise<{ success: boolean, progresses?: any[] }> => {
        try {
            const response = await api.get(`/patients/${patientID}/progress/`);
            return { success: true, progresses: response.data };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Retorna dados de um unico usuário
     * @returns 
     */
    getById: async (patientID: number, id: number): Promise<{ success: boolean, progress: any }> => {
        try {
            const response = await api.get(`/patients/${patientID}/progress/${id}`);
            console.log(response);
            return { success: true, progress: response.data };
        } catch (erro) {
            return { success: false, progress: null };
        }
    },

    /**
     * Cria um usuário
     * @param progress 
     * @returns 
     */
    create: async (progress: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.post(`/patients/${progress.patient_id}/progress`, progress);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Atualiza um usuário
     * @param progress 
     * @returns 
     */
    update: async (progress: any): Promise<{ success: boolean, error?: string }> => {
        try {
            await api.put(`/patients/${progress.patient_id}/progress/${progress.id}`, progress);
            return { success: true };
        } catch (erro: any) {
            const mensagem = erro.response.data.join('\n');
            return { success: false, error: mensagem };
        }
    },

    /**
     * Remove um usuário
     * @param progress 
     * @returns 
     */
    delete: async (progress: any): Promise<{ success: boolean }> => {
        try {
            await api.delete(`/patients/${progress.patient_id}/progress/${progress.id}`);
            return { success: true };
        } catch (erro: any) {
            return { success: false };
        }
    }


}

export default ProgressServices;