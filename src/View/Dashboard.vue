<template>
  <Layout 
    titre="Dashboard SuperAdmin"
    description="Vue d'ensemble de la plateforme SG Stocks"
  >
    <div class="p-6 space-y-6">

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-3">
          <RefreshCw class="w-6 h-6 animate-spin text-blue-600" />
          <span class="text-lg text-gray-600">Chargement des données...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <AlertTriangle class="w-5 h-5 text-red-600" />
          <div>
            <h3 class="font-medium text-red-800">Erreur de chargement</h3>
            <p class="text-sm text-red-600">{{ error }}</p>
            <button @click="loadDashboardData" class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <template v-else>

        <!-- Header sans bouton actualiser -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard SuperAdmin</h1>
          <p class="text-gray-600 flex items-center gap-2">
            <Clock class="w-4 h-4" />
            Dernière mise à jour: {{ formatTime(lastRefresh) }}
          </p>
        </div>

        <!-- Cards statistiques principales avec design amélioré -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card Entreprises -->
          <div class="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {{ dashboardData.active_companies }} actives
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Entreprises</p>
              <p class="text-3xl font-bold text-gray-900">{{ dashboardData.total_companies }}</p>
            </div>
          </div>

          <!-- Card Utilisateurs -->
          <div class="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Users class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {{ averageUsersPerCompany }} /entreprise
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Utilisateurs Total</p>
              <p class="text-3xl font-bold text-gray-900">{{ dashboardData.total_users || 0 }}</p>
            </div>
          </div>

          <!-- Card Revenus -->
          <div class="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                +12%
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Revenus ce mois</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(dashboardData.monthly_revenue) }}</p>
            </div>
          </div>

          <!-- Card Stockage -->
          <div class="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Package class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                {{ totalStorageLimit }}GB
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Stockage utilisé</p>
              <p class="text-3xl font-bold text-gray-900">{{ dashboardData.total_storage_gb }}GB</p>
            </div>
          </div>

        </section>

        <!-- Alertes importantes -->
        <section v-if="importantAlerts.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
            <AlertTriangle class="w-5 h-5" />
            Alertes importantes ({{ importantAlerts.length }})
          </h2>
          <div class="space-y-3">
            <div v-for="alert in importantAlerts" :key="alert.id" 
                 class="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <component :is="getAlertIcon(alert.type)" class="w-5 h-5 text-orange-600" />
              <div class="flex-1">
                <p class="font-medium">{{ alert.title }}</p>
                <p class="text-sm text-gray-600">{{ alert.description }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ formatRelativeTime(alert.created_at) }}</span>
            </div>
          </div>
        </section>

        <!-- Grille activités récentes -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Nouvelles entreprises -->
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">Nouvelles Entreprises</h3>
            <div class="space-y-3">
              <div v-for="company in recentCompanies" :key="company.id" 
                   class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium">{{ company.name }}</p>
                  <p class="text-sm text-gray-500">{{ company.schema_name }}</p>
                </div>
                <span class="text-xs text-gray-400">{{ formatRelativeTime(company.created_on) }}</span>
              </div>
              <p v-if="recentCompanies.length === 0" class="text-gray-500 text-sm">
                Aucune nouvelle entreprise
              </p>
            </div>
          </div>

          <!-- Support tickets récents -->
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">Tickets Support Récents</h3>
            <div class="space-y-3">
              <div v-for="ticket in recentTickets" :key="ticket.id" 
                   class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  ticket.priority === 'urgent' ? 'bg-red-500' : 
                  ticket.priority === 'high' ? 'bg-orange-500' : 'bg-green-500'
                ]"></div>
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ ticket.title }}</p>
                  <p class="text-xs text-gray-500">{{ ticket.customer_name }} - {{ ticket.priority }}</p>
                </div>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full',
                  ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ ticket.status }}
                </span>
              </div>
              <p v-if="recentTickets.length === 0" class="text-gray-500 text-sm">
                Aucun ticket récent
              </p>
            </div>
          </div>

        </section>

      </template>

    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Layout from './../components/Layout.vue'
import {
  Package,
  Building2,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-vue-next'
import { superAdminApi } from '../services/superadmin-api'

// État réactif
const dashboardData = ref(null)
const loading = ref(true)
const error = ref(null)
const lastRefresh = ref(new Date())

// Chargement des données
const loadDashboardData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Charger les métriques depuis l'API SuperAdmin
    const [metricsResponse, overviewResponse] = await Promise.all([
      superAdminApi.dashboard.metrics(),
      superAdminApi.dashboard.overview()
    ])
    
    // Combiner les données
    dashboardData.value = {
      ...metricsResponse.data,
      ...overviewResponse.data
    }
    
    lastRefresh.value = new Date()
    console.log('✅ Données dashboard chargées:', dashboardData.value)
  } catch (err) {
    console.error('❌ Erreur chargement dashboard:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur lors du chargement des données'
    
    // Données de fallback pour le développement
    console.log('ℹ️ Utilisation des données de fallback')
    dashboardData.value = {
      total_companies: 2,
      active_companies: 2,
      total_users: 25,
      monthly_revenue: 45000,
      total_storage_gb: 2.5,
      recent_companies: [
        {
          id: 1,
          name: 'Public Tenant',
          schema_name: 'public',
          created_on: '2025-12-20T10:30:00Z'
        },
        {
          id: 2,
          name: 'Mayor Company',
          schema_name: 'mayor',
          created_on: '2025-12-19T15:45:00Z'
        }
      ],
      recent_tickets: [
        {
          id: 1,
          title: 'Test de fonctionnement',
          customer_name: 'Système',
          priority: 'low',
          status: 'open'
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'info',
          title: 'Mode développement',
          description: 'Utilisation des données de test',
          created_at: '2025-12-22T08:30:00Z'
        }
      ]
    }
    lastRefresh.value = new Date()
  } finally {
    loading.value = false
  }
}

// Computed properties
const averageUsersPerCompany = computed(() => {
  if (!dashboardData.value) return 0
  return Math.round(dashboardData.value.total_users / dashboardData.value.total_companies)
})

const totalStorageLimit = computed(() => {
  return dashboardData.value ? dashboardData.value.total_companies * 10 : 0
})

const importantAlerts = computed(() => {
  return dashboardData.value?.alerts || []
})

const recentCompanies = computed(() => {
  return dashboardData.value?.recent_companies || []
})

const recentTickets = computed(() => {
  return dashboardData.value?.recent_tickets || []
})

// Méthodes utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR')
}

const getAlertIcon = (type) => {
  switch (type) {
    case 'quota': return Package
    case 'payment': return DollarSign
    case 'performance': return TrendingUp
    default: return AlertTriangle
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>
