/**
 * Service API spécifique pour AdminSgStock (SuperAdmin)
 * Force l'utilisation de l'API sans tenant-specific URLs
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// Configuration API pour SuperAdmin
const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || 'localhost'
const API_PORT = import.meta.env.VITE_API_PORT || '8000'
const API_BASE_URL = API_PORT === '80' || API_PORT === '443' 
  ? `http://${API_BASE_DOMAIN}/api/v1`
  : `http://${API_BASE_DOMAIN}:${API_PORT}/api/v1`

const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 secondes pour création de tenant (migrations + setup)
  withCredentials: true
}

// Création de l'instance Axios pour SuperAdmin
const ApiClient: AxiosInstance = axios.create(API_CONFIG)

// Intercepteur de requête pour ajouter le token d'authentification
ApiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les erreurs globales
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      
      // Redirection vers la page de connexion (si pas déjà sur cette page)
      if (!window.location.pathname.includes('/') || window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Méthodes API simplifiées pour SuperAdmin
 */
export const superAdminApi = {
  // Méthodes CRUD génériques
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    ApiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    ApiClient.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    ApiClient.put(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    ApiClient.delete(url, config),

  // Endpoints spécifiques SuperAdmin
  companies: {
    list: () => ApiClient.get('/superadmin/companies/'),
    get: (id: number) => ApiClient.get(`/superadmin/companies/${id}/`),
    create: (data: any) => ApiClient.post('/superadmin/companies/', data),
    update: (id: number, data: any) => ApiClient.put(`/superadmin/companies/${id}/`, data),
    delete: (id: number) => ApiClient.delete(`/superadmin/companies/${id}/`),
    suspend: (id: number) => ApiClient.post(`/superadmin/companies/${id}/suspend/`),
    activate: (id: number) => ApiClient.post(`/superadmin/companies/${id}/activate/`)
  },

  billing: {
    list: () => ApiClient.get('/superadmin/billing/'),
    get: (id: number) => ApiClient.get(`/superadmin/billing/${id}/`),
    create: (data: any) => ApiClient.post('/superadmin/billing/', data),
    update: (id: number, data: any) => ApiClient.put(`/superadmin/billing/${id}/`, data),
    generateMonthly: () => ApiClient.post('/superadmin/billing/generate_monthly/'),
    markPaid: (id: number) => ApiClient.post(`/superadmin/billing/${id}/mark_paid/`),
    revenueSummary: () => ApiClient.get('/superadmin/billing/revenue_summary/')
  },

  support: {
    list: () => ApiClient.get('/superadmin/support/'),
    get: (id: number) => ApiClient.get(`/superadmin/support/${id}/`),
    create: (data: any) => ApiClient.post('/superadmin/support/', data),
    update: (id: number, data: any) => ApiClient.put(`/superadmin/support/${id}/`, data),
    close: (id: number) => ApiClient.post(`/superadmin/support/${id}/close/`)
  },

  audit: {
    list: () => ApiClient.get('/superadmin/audit-logs/'),
    get: (id: number) => ApiClient.get(`/superadmin/audit-logs/${id}/`)
  },

  dashboard: {
    metrics: () => ApiClient.get('/superadmin/dashboard/metrics/'),
    overview: () => ApiClient.get('/superadmin/dashboard/overview/')
  },

  users: {
    list: (params?: any) => ApiClient.get('/auth/users/', { params }),
    get: (id: number) => ApiClient.get(`/auth/users/${id}/`),
    create: (data: any) => ApiClient.post('/auth/users/', data),
    update: (id: number, data: any) => ApiClient.put(`/auth/users/${id}/`, data),
    delete: (id: number) => ApiClient.delete(`/auth/users/${id}/`),
    activate: (id: number) => ApiClient.post(`/auth/users/${id}/activate/`),
    deactivate: (id: number) => ApiClient.post(`/auth/users/${id}/deactivate/`),
    resetPassword: (id: number, data: any) => ApiClient.post(`/auth/users/${id}/reset_password/`, data),
    stats: () => ApiClient.get('/auth/users/stats/'),
    me: () => ApiClient.get('/main/users/me/')
  }
}

// Export par défaut de l'instance configurée
export default ApiClient