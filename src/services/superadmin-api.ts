/**
 * Service API spécifique pour AdminSgStock (SuperAdmin)
 * Force l'utilisation de localhost:8000 sans tenant-specific URLs
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// Configuration API pour SuperAdmin
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1/superadmin',
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

    console.log(`🌐 SuperAdmin API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les erreurs globales
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ SuperAdmin API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error(`❌ SuperAdmin API Error:`, {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    })

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
    list: () => ApiClient.get('/companies/'),
    get: (id: number) => ApiClient.get(`/companies/${id}/`),
    create: (data: any) => ApiClient.post('/companies/', data),
    update: (id: number, data: any) => ApiClient.put(`/companies/${id}/`, data),
    delete: (id: number) => ApiClient.delete(`/companies/${id}/`),
    suspend: (id: number) => ApiClient.post(`/companies/${id}/suspend/`),
    activate: (id: number) => ApiClient.post(`/companies/${id}/activate/`)
  },

  billing: {
    list: () => ApiClient.get('/billing/'),
    get: (id: number) => ApiClient.get(`/billing/${id}/`),
    create: (data: any) => ApiClient.post('/billing/', data),
    update: (id: number, data: any) => ApiClient.put(`/billing/${id}/`, data),
    generateMonthly: () => ApiClient.post('/billing/generate_monthly/'),
    markPaid: (id: number) => ApiClient.post(`/billing/${id}/mark_paid/`),
    revenueSummary: () => ApiClient.get('/billing/revenue_summary/')
  },

  support: {
    list: () => ApiClient.get('/support/'),
    get: (id: number) => ApiClient.get(`/support/${id}/`),
    create: (data: any) => ApiClient.post('/support/', data),
    update: (id: number, data: any) => ApiClient.put(`/support/${id}/`, data),
    close: (id: number) => ApiClient.post(`/support/${id}/close/`)
  },

  audit: {
    list: () => ApiClient.get('/audit-logs/'),
    get: (id: number) => ApiClient.get(`/audit-logs/${id}/`)
  },

  dashboard: {
    metrics: () => ApiClient.get('/dashboard/metrics/'),
    overview: () => ApiClient.get('/dashboard/overview/')
  },

  users: {
    list: (params?: any) => axios.get('http://localhost:8000/api/v1/auth/users/', { 
      params,
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    }),
    get: (id: number) => axios.get(`http://localhost:8000/api/v1/auth/users/${id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    create: (data: any) => axios.post('http://localhost:8000/api/v1/auth/users/', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    update: (id: number, data: any) => axios.put(`http://localhost:8000/api/v1/auth/users/${id}/`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    delete: (id: number) => axios.delete(`http://localhost:8000/api/v1/auth/users/${id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    activate: (id: number) => axios.post(`http://localhost:8000/api/v1/auth/users/${id}/activate/`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    deactivate: (id: number) => axios.post(`http://localhost:8000/api/v1/auth/users/${id}/deactivate/`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    resetPassword: (id: number, data: any) => axios.post(`http://localhost:8000/api/v1/auth/users/${id}/reset_password/`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    stats: () => axios.get('http://localhost:8000/api/v1/auth/users/stats/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }),
    me: () => axios.get('http://localhost:8000/api/v1/auth/users/me/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
  }
}

// Export par défaut de l'instance configurée
export default ApiClient