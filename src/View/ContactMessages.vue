<template>
  <Layout 
    titre="Messages de Contact"
    description="Gérez les messages reçus depuis le site public"
  >
    <div class="p-6 space-y-6">
      <!-- Statistiques rapides -->
      <div class="flex gap-4">
        <div class="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
          <div class="text-2xl font-bold">{{ stats.new }}</div>
          <div class="text-xs">Nouveaux</div>
        </div>
        <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <div class="text-2xl font-bold">{{ stats.read }}</div>
          <div class="text-xs">Lus</div>
        </div>
        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <div class="text-2xl font-bold">{{ stats.replied }}</div>
          <div class="text-xs">Répondus</div>
        </div>
      </div>

    <!-- Filtres -->
    <div class="bg-white p-4 rounded-lg shadow-sm flex gap-4">
      <select v-model="filterStatus" class="px-4 py-2 border rounded-lg">
        <option value="">Tous les statuts</option>
        <option value="new">Nouveaux</option>
        <option value="read">Lus</option>
        <option value="replied">Répondus</option>
        <option value="archived">Archivés</option>
      </select>
      
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou email..."
        class="flex-1 px-4 py-2 border rounded-lg"
      />
    </div>

    <!-- Liste des messages -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="loading" class="text-center">
            <td colspan="5" class="px-6 py-8 text-gray-500">
              Chargement...
            </td>
          </tr>
          <tr v-else-if="filteredMessages.length === 0" class="text-center">
            <td colspan="5" class="px-6 py-8 text-gray-500">
              Aucun message trouvé
            </td>
          </tr>
          <tr
            v-else
            v-for="message in filteredMessages"
            :key="message.id"
            class="hover:bg-gray-50 transition"
            :class="{ 'bg-blue-50': message.status === 'new' }"
          >
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(message.status)"
              >
                {{ getStatusLabel(message.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium">{{ message.first_name }} {{ message.last_name }}</div>
              <div class="text-sm text-gray-500">{{ message.email }}</div>
              <div class="text-sm text-gray-500">{{ message.phone }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm line-clamp-2">{{ message.message }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(message.created_at) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button
                  @click="viewMessage(message)"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Voir
                </button>
                <button
                  v-if="message.status !== 'replied'"
                  @click="openResponseModal(message)"
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Répondre
                </button>
                <button
                  @click="deleteMessage(message.id)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

    <!-- Modale de détails -->
    <div
      v-if="selectedMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="selectedMessage = null"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold">
                {{ selectedMessage.first_name }} {{ selectedMessage.last_name }}
              </h2>
              <p class="text-gray-600">{{ selectedMessage.email }}</p>
              <p class="text-gray-600">{{ selectedMessage.phone }}</p>
            </div>
            <button @click="selectedMessage = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div class="bg-gray-50 p-4 rounded-lg">
              {{ selectedMessage.message }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div class="text-gray-600">
              {{ formatDate(selectedMessage.created_at) }}
            </div>
          </div>

          <div v-if="selectedMessage.response">
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              {{ selectedMessage.response }}
            </div>
            <div class="text-sm text-gray-500 mt-2">
              Répondu le {{ formatDate(selectedMessage.responded_at) }}
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex justify-end gap-3">
          <button
            @click="selectedMessage = null"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
          <button
            v-if="!selectedMessage.response"
            @click="openResponseModal(selectedMessage); selectedMessage = null"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Répondre
          </button>
        </div>
      </div>
    </div>

    <!-- Modale de réponse -->
    <div
      v-if="responseModalMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeResponseModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
        @click.stop
      >
        <div class="p-6 border-b">
          <h2 class="text-2xl font-bold">
            Répondre à {{ responseModalMessage.first_name }} {{ responseModalMessage.last_name }}
          </h2>
          <p class="text-gray-600">{{ responseModalMessage.email }}</p>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Message original</label>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              {{ responseModalMessage.message }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
            <textarea
              v-model="responseText"
              rows="6"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Écrivez votre réponse ici..."
            ></textarea>
          </div>
        </div>

        <div class="p-6 border-t flex justify-end gap-3">
          <button
            @click="closeResponseModal"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="sendResponse"
            :disabled="!responseText.trim() || sending"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ sending ? 'Envoi...' : 'Envoyer la réponse' }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from './../components/Layout.vue'
import { useDialog } from '../composables/useDialog'
import { useToast } from '../composables/useToast'

const dialog = useDialog()
const toast = useToast()

const messages = ref([])
const stats = ref({
  new: 0,
  read: 0,
  replied: 0,
  archived: 0,
  total: 0
})
const loading = ref(false)
const filterStatus = ref('')
const searchQuery = ref('')
const selectedMessage = ref(null)
const responseModalMessage = ref(null)
const responseText = ref('')
const sending = ref(false)

const protocol = import.meta.env.VITE_USE_HTTPS === 'true' ? 'https' : 'http'
const API_URL = `${protocol}://${import.meta.env.VITE_API_BASE_DOMAIN}/api/v1/auth`

const filteredMessages = computed(() => {
  let filtered = messages.value || []

  if (filterStatus.value) {
    filtered = filtered.filter(m => m && m.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m && m.first_name && m.last_name && m.email &&
      (m.first_name.toLowerCase().includes(query) ||
      m.last_name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query))
    )
  }

  return filtered.filter(m => m !== null && m !== undefined)
})

async function fetchMessages() {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return
    }
    
    const response = await fetch(`${API_URL}/contact-messages/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // L'API retourne un objet de pagination avec results
      messages.value = data.results || (Array.isArray(data) ? data : [])
    } else {
      messages.value = []
    }
  } catch (error) {
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/contact-messages/stats/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      stats.value = await response.json()
    }
  } catch (error) {
    }
}

function viewMessage(message) {
  selectedMessage.value = message
  if (message.status === 'new') {
    markAsRead(message.id)
  }
}

async function markAsRead(id) {
  try {
    const token = localStorage.getItem('auth_token')
    await fetch(`${API_URL}/contact-messages/${id}/mark_as_read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    await fetchMessages()
    await fetchStats()
  } catch (error) {
    }
}

function openResponseModal(message) {
  responseModalMessage.value = message
  responseText.value = ''
}

function closeResponseModal() {
  responseModalMessage.value = null
  responseText.value = ''
}

async function sendResponse() {
  if (!responseText.value.trim()) return
  
  sending.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/contact-messages/${responseModalMessage.value.id}/respond/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response: responseText.value
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.email_sent) {
        toast.success(
          'Réponse enregistrée',
          'Email envoyé au client avec succès',
          undefined
        )
      } else {
        // Email non envoyé mais réponse enregistrée
        const errorDetails = data.email_error || 'Erreur inconnue lors de l\'envoi de l\'email'
        toast.warning(
          'Réponse enregistrée',
          'Attention: Email non envoyé',
          errorDetails
        )
      }
      
      closeResponseModal()
      await fetchMessages()
      await fetchStats()
    } else {
      toast.error('Erreur', 'Impossible d\'envoyer la réponse', 'Veuillez réessayer plus tard')
    }
  } catch (error) {
    toast.error('Erreur réseau', 'Impossible de communiquer avec le serveur', error.message)
  } finally {
    sending.value = false
  }
}

async function deleteMessage(id) {
  const confirmed = await dialog.confirm(
    'Supprimer ce message',
    'Êtes-vous sûr de vouloir supprimer ce message de contact ?',
    'Cette action est irréversible.'
  )
  if (!confirmed) return
  
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/contact-messages/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      toast.success('Message supprimé', 'Le message a été supprimé avec succès')
      await fetchMessages()
      await fetchStats()
    } else {
      toast.error('Erreur', 'Impossible de supprimer le message', 'Veuillez réessayer')
    }
  } catch (error) {
    toast.error('Erreur réseau', 'Impossible de communiquer avec le serveur', error.message)
  }
}

function getStatusClass(status) {
  const classes = {
    new: 'bg-red-100 text-red-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    new: 'Nouveau',
    read: 'Lu',
    replied: 'Répondu',
    archived: 'Archivé'
  }
  return labels[status] || status
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('auth_token')
  if (!token) {
    // Rediriger vers la page de connexion si pas de token
    window.location.href = '/Connexion'
    return
  }
  
  fetchMessages()
  fetchStats()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
