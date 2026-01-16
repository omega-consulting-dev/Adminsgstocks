<template>
  <Layout 
    titre="Support Client"
    description="Gestion des tickets et demandes"
  >
    <div class="p-6 space-y-6">

      <!-- Statistiques support -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ticket class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Tickets ouverts</p>
              <p class="text-2xl font-bold text-gray-900">{{ openTicketsCount }}</p>
              <p class="text-xs text-blue-600">{{ newTicketsToday }} nouveaux aujourd'hui</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Résolus ce mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ resolvedThisMonth }}</p>
              <p class="text-xs text-green-600">Taux: {{ resolutionRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Temps réponse moyen</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageResponseTime }}h</p>
              <p class="text-xs text-orange-600">Objectif: 24h</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Urgents</p>
              <p class="text-2xl font-bold text-gray-900">{{ urgentTicketsCount }}</p>
              <p class="text-xs text-red-600">Attention requise</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Analyse rapide -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Analyse des Demandes</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Top catégories -->
          <div>
            <h3 class="font-medium mb-3">Top Catégories</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm">Problème technique</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-200 rounded">
                    <div class="w-16 h-2 bg-blue-500 rounded"></div>
                  </div>
                  <span class="text-xs text-gray-500">67%</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm">Facturation</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-200 rounded">
                    <div class="w-8 h-2 bg-green-500 rounded"></div>
                  </div>
                  <span class="text-xs text-gray-500">33%</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm">Formation</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-200 rounded">
                    <div class="w-4 h-2 bg-orange-500 rounded"></div>
                  </div>
                  <span class="text-xs text-gray-500">17%</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Satisfaction -->
          <div>
            <h3 class="font-medium mb-3">Satisfaction Client</h3>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">4.6/5</div>
              <p class="text-sm text-gray-500">Note moyenne</p>
              <p class="text-xs text-gray-400">Basé sur 45 évaluations</p>
            </div>
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
  Ticket, CheckCircle, Clock, AlertTriangle, RefreshCw,
  Eye, UserPlus, MessageSquare, X, User
} from 'lucide-vue-next'

// État réactif
const openTicketsCount = ref(12)
const newTicketsToday = ref(3)
const resolvedThisMonth = ref(47)
const resolutionRate = ref(94)
const averageResponseTime = ref(18)
const urgentTicketsCount = ref(2)

const priorityFilter = ref('')
const statusFilter = ref('')

const tickets = ref([
  {
    id: 1,
    ticket_number: 'SUP-2025-001',
    requester_name: 'Jean Mballa',
    company_name: 'SuperMarché Douala',
    requester_email: 'jean@supermarche-douala.cm',
    subject: 'Problème synchronisation stock',
    description: 'Les quantités ne se mettent pas à jour automatiquement...',
    priority: 'urgent',
    status: 'open',
    category: 'Technique',
    assigned_agent: null,
    created_at: '2025-01-15T08:30:00Z'
  },
  {
    id: 2,
    ticket_number: 'SUP-2025-002',
    requester_name: 'Marie Fouda',
    company_name: 'Boutique Maman Marie',
    requester_email: 'marie@boutique.cm',
    subject: 'Question sur la facturation',
    description: 'Je ne comprends pas les frais additionnels sur ma facture...',
    priority: 'medium',
    status: 'in_progress',
    category: 'Billing',
    assigned_agent: 'Support Agent 1',
    created_at: '2025-01-14T14:20:00Z'
  },
  {
    id: 3,
    ticket_number: 'SUP-2025-003',
    requester_name: 'Paul Nkomo',
    company_name: 'Tech Solutions',
    requester_email: 'paul@techsol.cm',
    subject: 'Formation équipe',
    description: 'Besoin de formation pour notre équipe sur les nouvelles fonctionnalités...',
    priority: 'low',
    status: 'pending',
    category: 'Training',
    assigned_agent: 'Support Agent 2',
    created_at: '2025-01-13T10:15:00Z'
  }
])

// Computed
const filteredTickets = computed(() => {
  let filtered = tickets.value
  
  if (priorityFilter.value) {
    filtered = filtered.filter(ticket => ticket.priority === priorityFilter.value)
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
  }
  
  return filtered
})

// Méthodes utilitaires
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return formatDate(dateString)
}

const getPriorityClass = (priority) => {
  const classes = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority) => {
  const labels = {
    urgent: 'Urgent',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse'
  }
  return labels[priority] || priority
}

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Ouvert',
    in_progress: 'En cours',
    pending: 'En attente',
    resolved: 'Résolu'
  }
  return labels[status] || status
}

// Actions
const refreshTickets = () => {
  console.log('Refreshing tickets...')
}

const createTicket = () => {
  console.log('Creating new ticket...')
}

const viewTicket = (id) => {
  console.log('Viewing ticket:', id)
}

const assignTicket = (id) => {
  console.log('Assigning ticket:', id)
}

const replyTicket = (id) => {
  console.log('Replying to ticket:', id)
}

const closeTicket = (id) => {
  console.log('Closing ticket:', id)
}

// Lifecycle
onMounted(() => {
  console.log('Support page loaded')
})
</script>