import api from './api';

export interface DatasetUser {
  name: string;
  email: string;
}

export type DatasetPathologyType = 'cancer' | 'qa' | 'eritroplasia' | 'leucoplasia';

export interface DatasetItem {
  image_url: string;
  type: string;
  positive: boolean;
  assurance: number;
  created_at: string;
  user: DatasetUser;
}

export interface DatasetFilter {
  name?: string;
  email?: string;
  type?: DatasetPathologyType;
}

export interface DatasetResponse {
  success: boolean;
  data?: DatasetItem[];
  error?: string;
}

/**
 * SERVIÇO DE GERENCIAMENTO DE IMAGENS DO DATASET
 */
const DatasetServices = {
  /**
   * Retorna a lista de imagens cadastradas do dataset com suporte a paginação e filtros
   */
  getAll: async (
    page: number = 1,
    filters: DatasetFilter = {}
  ): Promise<DatasetResponse> => {
    try {
      const params = new URLSearchParams();
      // ============= FILTROS =================================
      params.set('page', page.toString());

      if (filters.name && filters.name.trim() !== '') {
        params.set('name', filters.name.trim());
      }
      if (filters.email && filters.email.trim() !== '') {
        params.set('email', filters.email.trim());
      }
      if (filters.type && filters.type.trim() !== '') {
        params.set('type', filters.type.trim());
      }
      // ============= FILTROS =================================

      const response = await api.get(`/dataset?${params.toString()}`);
      const items = Array.isArray(response.data) ? response.data : (response.data?.items ?? []);

      return {
        success: true,
        data: items,
      };
    } catch (error: unknown) {
      console.error('Erro ao buscar dataset:', error);
      let message = 'Falha ao carregar imagens do dataset.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const resp = (error as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) {
          message = resp.data.message;
        }
      }
      return {
        success: false,
        error: message,
      };
    }
  },
};

export default DatasetServices;
