<script setup>
import Layout from './../components/Layout.vue'
import { 
  Bell, 
  UserPlus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Package,
  CreditCard,
  X,
  Eye,
  Trash2
} from 'lucide-vue-next'
import { ref } from 'vue'

// Filtres
const selectedFilter = ref('all')
const filters = [
  { value: 'all', label: 'Toutes', count: 24 },
  { value: 'new', label: 'Nouvelles souscriptions', count: 8 },
  { value: 'active', label: 'Entreprises actives', count: 5 },
  { value: 'inactive', label: 'Entreprises inactives', count: 4 },
  { value: 'expiring', label: 'Packs expirant', count: 7 }
]

// Statistiques rapides
const stats = [
  {
    icon: UserPlus,
    number: 8,
    label: "Nouvelles souscriptions (7j)",
    bg: "bg-blue-100",
    text: "text-blue-500",
    trend: "+12%"
  },
  {
    icon: TrendingUp,
    number: 23,
    label: "Entreprises très actives",
    bg: "bg-green-100",
    text: "text-green-500",
    trend: "+5%"
  },
  {
    icon: TrendingDown,
    number: 6,
    label: "Entreprises inactives (30j)",
    bg: "bg-orange-100",
    text: "text-orange-500",
    trend: "-2%"
  },
  {
    icon: AlertTriangle,
    number: 12,
    label: "Packs expirant sous 7 jours",
    bg: "bg-red-100",
    text: "text-red-500",
    trend: "Urgent"
  }
]

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'new_subscription',
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Nouvelle souscription',
    message: 'TechStore SN a souscrit au pack Professionnel',
    company: 'TechStore SN',
    details: 'Pack: Professionnel • 5 points de vente',
    time: "Il y a 2 heures",
    date: '15/01/2024',
    unread: true,
    priority: 'normal'
  },
  {
    id: 2,
    type: 'expiring',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Pack expirant dans 3 jours',
    message: 'Le pack de Boutique Mbaye expire bientôt',
    company: 'Boutique Mbaye',
    details: 'Pack: Populaire • Expire le 18/01/2024',
    time: "Il y a 4 heures",
    date: '15/01/2024',
    unread: true,
    priority: 'high'
  },
  {
    id: 3,
    type: 'active',
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Entreprise très active',
    message: 'Super Marché Dakar a généré 150 transactions aujourd\'hui',
    company: 'Super Marché Dakar',
    details: '150 transactions • +45% vs hier',
    time: "Il y a 6 heures",
    date: '15/01/2024',
    unread: true,
    priority: 'normal'
  },
  {
    id: 4,
    type: 'payment',
    icon: CreditCard,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Paiement reçu',
    message: 'Pharmacie Thiès a effectué un paiement de XAF 320,000',
    company: 'Pharmacie Thiès',
    details: 'Montant: XAF 320,000 • Méthode: Mobile Money',
    time: "Il y a 1 jour",
    date: '14/01/2024',
    unread: false,
    priority: 'normal'
  },
  {
    id: 5,
    type: 'inactive',
    icon: TrendingDown,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Entreprise inactive',
    message: 'Électronique Plus n\'a eu aucune activité depuis 15 jours',
    company: 'Électronique Plus',
    details: 'Dernière connexion: 30/12/2024',
    time: "Il y a 1 jour",
    date: '14/01/2024',
    unread: false,
    priority: 'medium'
  },
  {
    id: 6,
    type: 'new_subscription',
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Nouvelle souscription',
    message: 'Nova Enterprise a souscrit au pack Standard',
    company: 'Nova Enterprise',
    details: 'Pack: Standard • 3 points de vente',
    time: "Il y a 2 jours",
    date: '13/01/2024',
    unread: false,
    priority: 'normal'
  },
  {
    id: 7,
    type: 'expiring',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Pack expirant dans 5 jours',
    message: 'Le pack de Matrix Corp expire bientôt',
    company: 'Matrix Corp',
    details: 'Pack: Standard • Expire le 20/01/2024',
    time: "Il y a 2 jours",
    date: '13/01/2024',
    unread: false,
    priority: 'high'
  },
  {
    id: 8,
    type: 'active',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Renouvellement automatique',
    message: 'Gamma Ltd a renouvelé automatiquement son pack',
    company: 'Gamma Ltd',
    details: 'Pack: Professionnel • Prochain paiement: 25/02/2024',
    time: "Il y a 3 jours",
    date: '12/01/2024',
    unread: false,
    priority: 'normal'
  }
])

const filterNotifications = () => {
  if (selectedFilter.value === 'all') return notifications.value
  
  const typeMap = {
    'new': 'new_subscription',
    'active': 'active',
    'inactive': 'inactive',
    'expiring': 'expiring'
  }
  
  return notifications.value.filter(n => n.type === typeMap[selectedFilter.value])
}

const markAsRead = (id) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.unread = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.unread = false)
}

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const getPriorityBadge = (priority) => {
  const badges = {
    high: { class: 'bg-red-100 text-red-700', label: 'Urgent' },
    medium: { class: 'bg-orange-100 text-orange-700', label: 'Important' },
    normal: { class: 'bg-gray-100 text-gray-700', label: 'Normal' }
  }
  return badges[priority] || badges.normal
}
</script>

<template>
  <Layout titre="Notifications" description="Alertes et activités du système">
    
    <article class="">
      
      <!-- Statistiques rapides -->
      <main class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="flex flex-col gap-2 rounded-[10px] bg-white border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div :class="['w-10 h-10 rounded-[10px] flex items-center justify-center', stat.bg]">
              <component :is="stat.icon" :class="['w-5 h-5', stat.text]" />
            </div>
            <span class="text-xs font-semibold text-green-600">{{ stat.trend }}</span>
          </div>
          
          <div class="flex flex-col mt-2">
            <span class="text-[30px] font-semibold">{{ stat.number }}</span>
            <span class="text-[13px] text-gray-600">{{ stat.label }}</span>
          </div>
        </div>
      </main>

      <!-- Filtres et Actions -->
      <div class="mt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-[10px] p-4 border border-gray-200">
        
        <!-- Filtres -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
            <span :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              selectedFilter === filter.value
                ? 'bg-white text-blue-600'
                : 'bg-gray-300 text-gray-700'
            ]">
              {{ filter.count }}
            </span>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button 
            @click="markAllAsRead"
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CheckCircle :size="16" />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="mt-6 space-y-3">
        
        <div
          v-for="notif in filterNotifications()"
          :key="notif.id"
          :class="[
            'bg-white rounded-[10px] p-5 border transition-all hover:shadow-md',
            notif.unread ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
          ]"
        >
          <div class="flex items-start gap-4">
            
            <!-- Icône -->
            <div :class="['w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0', notif.iconBg]">
              <component :is="notif.icon" :class="['w-6 h-6', notif.iconColor]" />
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base font-semibold text-gray-900">{{ notif.title }}</h3>
                    <span 
                      v-if="notif.unread"
                      class="w-2 h-2 bg-blue-600 rounded-full"
                    ></span>
                    <span 
                      :class="getPriorityBadge(notif.priority).class"
                      class="px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ getPriorityBadge(notif.priority).label }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-700 mb-2">{{ notif.message }}</p>
                  
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span class="font-medium text-blue-600">{{ notif.company }}</span>
                    <span>•</span>
                    <span>{{ notif.details }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <button 
                    v-if="notif.unread"
                    @click="markAsRead(notif.id)"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Marquer comme lu"
                  >
                    <Eye :size="16" class="text-gray-600" />
                  </button>
                  <button 
                    @click="deleteNotification(notif.id)"
                    class="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 :size="16" class="text-red-600" />
                  </button>
                </div>
              </div>

              <!-- Date/Heure -->
              <div class="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span>{{ notif.time }}</span>
                <span>•</span>
                <span>{{ notif.date }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Message si aucune notification -->
        <div 
          v-if="filterNotifications().length === 0"
          class="bg-white rounded-[10px] p-12 text-center border border-gray-200"
        >
          <Bell :size="48" class="mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
          <p class="text-sm text-gray-500">Il n'y a pas de notifications pour ce filtre.</p>
        </div>

      </div>

      <!-- Section Entreprises les plus actives -->
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Top Entreprises Actives -->
        <div class="bg-white rounded-[10px] p-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Entreprises les plus actives</h3>
              <p class="text-sm text-gray-500">Derniers 7 jours</p>
            </div>
            <TrendingUp :size="24" class="text-green-500" />
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Super Marché Dakar</p>
                  <p class="text-xs text-gray-500">852 transactions</p>
                </div>
              </div>
              <span class="text-green-600 font-semibold">+45%</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">TechStore SN</p>
                  <p class="text-xs text-gray-500">634 transactions</p>
                </div>
              </div>
              <span class="text-green-600 font-semibold">+32%</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Pharmacie Thiès</p>
                  <p class="text-xs text-gray-500">487 transactions</p>
                </div>
              </div>
              <span class="text-green-600 font-semibold">+28%</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Boutique Mbaye</p>
                  <p class="text-xs text-gray-500">321 transactions</p>
                </div>
              </div>
              <span class="text-green-600 font-semibold">+15%</span>
            </div>
          </div>
        </div>

        <!-- Entreprises Inactives -->
        <div class="bg-white rounded-[10px] p-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Entreprises inactives</h3>
              <p class="text-sm text-gray-500">Aucune activité depuis 30 jours</p>
            </div>
            <TrendingDown :size="24" class="text-orange-500" />
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p class="font-medium text-gray-900">Électronique Plus</p>
                <p class="text-xs text-gray-500">Dernière activité: 15/12/2024</p>
              </div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                45 jours
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p class="font-medium text-gray-900">Matrix Corp</p>
                <p class="text-xs text-gray-500">Dernière activité: 20/12/2024</p>
              </div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                40 jours
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p class="font-medium text-gray-900">Delta Group</p>
                <p class="text-xs text-gray-500">Dernière activité: 25/12/2024</p>
              </div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                35 jours
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p class="font-medium text-gray-900">Skyline Ltd</p>
                <p class="text-xs text-gray-500">Dernière activité: 28/12/2024</p>
              </div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                32 jours
              </span>
            </div>
          </div>
        </div>

      </div>

    </article>

  </Layout>
</template>

<style scoped>
/* Animation pour les nouvelles notifications */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-item {
  animation: slideIn 0.3s ease-out;
}
</style>