<template>
  <Layout 
    titre="Paramètres Système"
    description="Configuration globale de la plateforme"
  >
    <div class="p-6 space-y-6">

      <!-- Configuration générale -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Configuration Générale</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom de la plateforme
              </label>
              <input v-model="settings.platform_name" 
                     type="text" 
                     class="w-full p-3 border rounded-lg">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email administrateur
              </label>
              <input v-model="settings.admin_email" 
                     type="email" 
                     class="w-full p-3 border rounded-lg">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Domaine principal
              </label>
              <input v-model="settings.main_domain" 
                     type="text" 
                     class="w-full p-3 border rounded-lg">
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mode maintenance
              </label>
              <div class="flex items-center gap-3">
                <button @click="toggleMaintenance" 
                        :class="[
                          'flex items-center gap-2 px-4 py-2 rounded-lg',
                          settings.maintenance_mode 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        ]">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    settings.maintenance_mode ? 'bg-red-500' : 'bg-green-500'
                  ]"></div>
                  {{ settings.maintenance_mode ? 'Activé' : 'Désactivé' }}
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Inscriptions ouvertes
              </label>
              <div class="flex items-center gap-3">
                <input v-model="settings.registration_open" 
                       type="checkbox" 
                       class="w-4 h-4">
                <span class="text-sm">Autoriser nouvelles inscriptions</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notification email
              </label>
              <div class="flex items-center gap-3">
                <input v-model="settings.email_notifications" 
                       type="checkbox" 
                       class="w-4 h-4">
                <span class="text-sm">Envoyer notifications par email</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6 pt-6 border-t">
          <button @click="saveSettings" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save class="w-4 h-4 inline mr-2" />
            Sauvegarder
          </button>
          <button @click="resetSettings" 
                  class="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Réinitialiser
          </button>
        </div>
      </section>

      <!-- Notifications système -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Configuration Notifications</h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p class="font-medium">Alertes quota stockage</p>
              <p class="text-sm text-gray-500">Notifier quand 90% du quota est atteint</p>
            </div>
            <input v-model="notifications.storage_alerts" 
                   type="checkbox" 
                   class="w-4 h-4">
          </div>
          
          <div class="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p class="font-medium">Rappels paiement</p>
              <p class="text-sm text-gray-500">Envoyer rappels 7 jours avant échéance</p>
            </div>
            <input v-model="notifications.payment_reminders" 
                   type="checkbox" 
                   class="w-4 h-4">
          </div>
          
          <div class="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p class="font-medium">Nouveaux tickets support</p>
              <p class="text-sm text-gray-500">Notifier les nouveaux tickets aux admins</p>
            </div>
            <input v-model="notifications.support_tickets" 
                   type="checkbox" 
                   class="w-4 h-4">
          </div>
          
          <div class="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p class="font-medium">Rapports hebdomadaires</p>
              <p class="text-sm text-gray-500">Envoyer résumé des activités chaque lundi</p>
            </div>
            <input v-model="notifications.weekly_reports" 
                   type="checkbox" 
                   class="w-4 h-4">
          </div>
        </div>
        
        <div class="flex gap-3 mt-4">
          <button @click="saveNotifications" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sauvegarder notifications
          </button>
        </div>
      </section>

      <!-- Actions système -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Actions Système</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button @click="cleanupLogs" 
                  class="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-left">
            <div class="flex items-center gap-3">
              <Trash2 class="w-6 h-6 text-blue-600" />
              <div>
                <p class="font-medium text-blue-900">Nettoyer les logs</p>
                <p class="text-sm text-blue-600">Supprimer les logs de plus de 90 jours</p>
              </div>
            </div>
          </button>
          
          <button @click="generateReports" 
                  class="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-left">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-green-600" />
              <div>
                <p class="font-medium text-green-900">Générer rapports</p>
                <p class="text-sm text-green-600">Créer rapport mensuel d'activité</p>
              </div>
            </div>
          </button>
          
          <button @click="backupDatabase" 
                  class="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 text-left">
            <div class="flex items-center gap-3">
              <Database class="w-6 h-6 text-purple-600" />
              <div>
                <p class="font-medium text-purple-900">Sauvegarde BD</p>
                <p class="text-sm text-purple-600">Créer sauvegarde complète</p>
              </div>
            </div>
          </button>
          
          <button @click="sendTestNotification" 
                  class="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 text-left">
            <div class="flex items-center gap-3">
              <Bell class="w-6 h-6 text-orange-600" />
              <div>
                <p class="font-medium text-orange-900">Test notification</p>
                <p class="text-sm text-orange-600">Envoyer notification de test</p>
              </div>
            </div>
          </button>
        </div>
      </section>

    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from './../components/Layout.vue'
import {
  Save, Plus, Edit, Power, Trash2, FileText, Database, Bell
} from 'lucide-vue-next'

// État réactif
const settings = ref({
  platform_name: 'SG Stocks Platform',
  admin_email: 'admin@sgstocks.cm',
  main_domain: 'sgstocks.cm',
  maintenance_mode: false,
  registration_open: true,
  email_notifications: true
})

const limits = ref({
  max_companies: 100,
  max_users_per_company: 50,
  default_storage_gb: 10
})

const notifications = ref({
  storage_alerts: true,
  payment_reminders: true,
  support_tickets: true,
  weekly_reports: false
})

const plans = ref([
  {
    id: 1,
    name: 'Starter',
    description: 'Pour petites entreprises',
    price: 15000,
    max_users: 5,
    max_storage_gb: 5,
    active: true
  },
  {
    id: 2,
    name: 'Business',
    description: 'Pour entreprises moyennes',
    price: 25000,
    max_users: 20,
    max_storage_gb: 20,
    active: true
  },
  {
    id: 3,
    name: 'Enterprise',
    description: 'Pour grandes entreprises',
    price: 50000,
    max_users: 0,
    max_storage_gb: 0,
    active: true
  }
])

// Méthodes utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Actions
const toggleMaintenance = () => {
  settings.value.maintenance_mode = !settings.value.maintenance_mode
  console.log('Maintenance mode:', settings.value.maintenance_mode)
}

const saveSettings = () => {
  console.log('Saving general settings...', settings.value)
}

const resetSettings = () => {
  console.log('Resetting settings...')
}

const saveLimits = () => {
  console.log('Saving system limits...', limits.value)
}

const saveNotifications = () => {
  console.log('Saving notification settings...', notifications.value)
}

const addPlan = () => {
  console.log('Adding new plan...')
}

const editPlan = (id) => {
  console.log('Editing plan:', id)
}

const togglePlan = (id) => {
  const plan = plans.value.find(p => p.id === id)
  if (plan) {
    plan.active = !plan.active
    console.log('Toggled plan:', id, plan.active)
  }
}

const cleanupLogs = () => {
  console.log('Cleaning up old logs...')
}

const generateReports = () => {
  console.log('Generating monthly reports...')
}

const backupDatabase = () => {
  console.log('Creating database backup...')
}

const sendTestNotification = () => {
  console.log('Sending test notification...')
}

// Lifecycle
onMounted(() => {
  console.log('Settings page loaded')
})
</script>