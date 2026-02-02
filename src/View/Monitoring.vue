<template>
  <Layout 
    titre="Monitoring & Logs"
    description="Surveillance système et activités"
  >
    <div class="p-6 space-y-6">

      <!-- Section métriques système -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Métriques Système</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Performance -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <Activity class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm text-blue-600">Temps réponse</p>
                <p class="text-xl font-bold text-blue-900">{{ metrics.avg_response_time }}ms</p>
              </div>
            </div>
          </div>

          <!-- Erreurs -->
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <AlertTriangle class="w-6 h-6 text-red-600" />
              <div>
                <p class="text-sm text-red-600">Taux d'erreur</p>
                <p class="text-xl font-bold text-red-900">{{ metrics.error_rate }}%</p>
              </div>
            </div>
          </div>

          <!-- Stockage -->
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <HardDrive class="w-6 h-6 text-green-600" />
              <div>
                <p class="text-sm text-green-600">Stockage total</p>
                <p class="text-xl font-bold text-green-900">{{ metrics.total_storage_gb }}GB</p>
              </div>
            </div>
          </div>

          <!-- Utilisateurs pic -->
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <Users class="w-6 h-6 text-purple-600" />
              <div>
                <p class="text-sm text-purple-600">Pic utilisateurs</p>
                <p class="text-xl font-bold text-purple-900">{{ metrics.peak_users }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Logs d'audit récents -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Logs d'Audit Récents</h2>
          <div class="flex gap-2">
            <select v-model="logFilter" class="px-3 py-1 border rounded">
              <option value="">Toutes actions</option>
              <option value="company_update">Mises à jour</option>
              <option value="company_suspend">Suspensions</option>
              <option value="plan_change">Changements plan</option>
            </select>
            <button @click="refreshLogs" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-3 text-left text-sm font-medium text-gray-500">TIMESTAMP</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">ADMIN</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">ACTION</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">ENTREPRISE</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
                <td class="p-3">
                  <div>
                    <p class="text-sm font-medium">{{ formatDateTime(log.timestamp) }}</p>
                    <p class="text-xs text-gray-500">{{ getRelativeTime(log.timestamp) }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User class="w-4 h-4 text-gray-600" />
                    </div>
                    <span class="text-sm">{{ log.admin_user }}</span>
                  </div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getActionClass(log.action_type)">
                    {{ log.action_type }}
                  </span>
                </td>
                <td class="p-3">
                  <span class="text-sm">{{ log.company_name || 'Système' }}</span>
                </td>
                <td class="p-3">
                  <p class="text-sm text-gray-900">{{ log.action_description }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredLogs.length === 0" class="text-center py-8 text-gray-500">
          Aucun log d'audit trouvé
        </div>
      </section>

      <!-- Alertes système -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Alertes Système</h2>
        
        <div class="space-y-3">
          <!-- Alerte quota -->
          <div class="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle class="w-5 h-5 text-yellow-600" />
            <div class="flex-1">
              <p class="font-medium text-yellow-800">Quota atteint</p>
              <p class="text-sm text-yellow-600">SuperMarché Douala approche la limite de stockage (90%)</p>
            </div>
            <span class="text-xs text-yellow-600">Il y a 2h</span>
          </div>

          <!-- Alerte expiration -->
          <div class="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <Clock class="w-5 h-5 text-orange-600" />
            <div class="flex-1">
              <p class="font-medium text-orange-800">Expiration prochaine</p>
              <p class="text-sm text-orange-600">Boutique Maman Marie expire dans 8 jours</p>
            </div>
            <span class="text-xs text-orange-600">Il y a 1h</span>
          </div>

          <!-- Alerte performance -->
          <div class="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Activity class="w-5 h-5 text-red-600" />
            <div class="flex-1">
              <p class="font-medium text-red-800">Performance dégradée</p>
              <p class="text-sm text-red-600">Temps de réponse élevé détecté (> 500ms)</p>
            </div>
            <span class="text-xs text-red-600">Il y a 30min</span>
          </div>
        </div>
      </section>

    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Layout from './../components/Layout.vue'
import {
  Activity, AlertTriangle, HardDrive, Users, RefreshCw, 
  Clock, User, Shield, Database
} from 'lucide-vue-next'

// État réactif
const metrics = ref({
  avg_response_time: 145,
  error_rate: 0.2,
  total_storage_gb: 127.5,
  peak_users: 342
})

const auditLogs = ref([
  {
    id: 1,
    timestamp: '2025-12-22T10:30:00Z',
    admin_user: 'superadmin',
    action_type: 'company_suspend',
    company_name: 'Tech Solutions',
    action_description: 'Suspended company for payment overdue'
  },
  {
    id: 2,
    timestamp: '2025-12-22T09:15:00Z',
    admin_user: 'support-agent',
    action_type: 'plan_change',
    company_name: 'Boutique Maman',
    action_description: 'Upgraded plan from starter to business'
  },
  {
    id: 3,
    timestamp: '2025-12-22T08:45:00Z',
    admin_user: 'superadmin',
    action_type: 'company_update',
    company_name: 'SuperMarché Douala',
    action_description: 'Updated billing information'
  }
])

const logFilter = ref('')

// Computed
const filteredLogs = computed(() => {
  if (!logFilter.value) return auditLogs.value
  return auditLogs.value.filter(log => log.action_type === logFilter.value)
})

// Méthodes utilitaires
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'À l\'instant'
  if (diffHours === 1) return 'Il y a 1h'
  if (diffHours < 24) return `Il y a ${diffHours}h`
  return `Il y a ${Math.floor(diffHours / 24)} jours`
}

const getActionClass = (actionType) => {
  const classes = {
    company_suspend: 'bg-red-100 text-red-800',
    company_activate: 'bg-green-100 text-green-800',
    plan_change: 'bg-blue-100 text-blue-800',
    company_update: 'bg-yellow-100 text-yellow-800'
  }
  return classes[actionType] || 'bg-gray-100 text-gray-800'
}

// Actions
const refreshLogs = () => {
  }

const loadMetrics = () => {
  // Simuler chargement des métriques
  }

// Lifecycle
onMounted(() => {
  loadMetrics()
})
</script>