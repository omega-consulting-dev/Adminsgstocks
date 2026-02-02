<script setup>
import { ref, onMounted, computed } from 'vue'
import { UserPlus, Search, Edit, Trash2, Shield, UserCheck, UserX, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'
import Layout from '../components/Layout.vue'
import { superAdminApi } from '../services/superadmin-api'
import { useDialog } from '../composables/useDialog'
import { useToast } from '../composables/useToast'

const dialog = useDialog()
const toast = useToast()

// État
const users = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const showAddModal = ref(false)
const editingUser = ref(null)

// Dialogs
const showConfirmDialog = ref(false)
const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const dialogMessage = ref('')
const errorDetails = ref('')

// Form data
const userForm = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  role: 'viewer',
  is_active: true
})

const roles = [
  { value: 'super_admin', label: 'Super Admin', color: 'red' },
  { value: 'admin', label: 'Admin', color: 'orange' },
  { value: 'viewer', label: 'Viewer', color: 'blue' }
]

// Charger les utilisateurs
const loadUsers = async () => {
  isLoading.value = true
  try {
    const response = await superAdminApi.users.list()
    // L'API retourne une structure paginée avec results
    const userData = response.data.results || response.data
    
    users.value = userData.map(user => ({
      ...user,
      // Utiliser role_name du backend ou calculer depuis is_staff/is_superuser
      role: user.role_name || (user.is_superuser ? 'super_admin' : (user.is_staff ? 'admin' : 'viewer'))
    })).filter(user => user.username && user.username.trim() !== '') // Filtrer les utilisateurs sans username
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error(
      'Erreur de chargement',
      'Impossible de charger les utilisateurs',
      error.response?.data?.detail || error.message || 'Erreur inconnue'
    )
  } finally {
    isLoading.value = false
  }
}

// Filtrer les utilisateurs
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    (user.username || '').toLowerCase().includes(query) ||
    (user.email || '').toLowerCase().includes(query) ||
    (user.first_name || '').toLowerCase().includes(query) ||
    (user.last_name || '').toLowerCase().includes(query)
  )
})

// Ouvrir le modal d'ajout
const openAddModal = () => {
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'viewer',
    is_active: true
  }
  showAddModal.value = true
}

// Ouvrir le modal d'édition
const openEditModal = (user) => {
  editingUser.value = user
  userForm.value = { 
    ...user,
    password: '' // Toujours vider le mot de passe lors de l'édition
  }
  showAddModal.value = true
}

// Ouvrir le dialog de confirmation
const openConfirmDialog = () => {
  if (editingUser.value) {
    dialogMessage.value = userForm.value.password 
      ? 'Êtes-vous sûr de vouloir modifier cet utilisateur et son mot de passe ?' 
      : 'Êtes-vous sûr de vouloir modifier cet utilisateur ?'
  } else {
    dialogMessage.value = 'Êtes-vous sûr de vouloir créer cet utilisateur ?'
  }
  showConfirmDialog.value = true
}

// Sauvegarder l'utilisateur
const saveUser = async () => {
  showConfirmDialog.value = false
  
  try {
    const userData = {
      username: userForm.value.username,
      email: userForm.value.email,
      first_name: userForm.value.first_name,
      last_name: userForm.value.last_name,
      is_active: userForm.value.is_active,
      is_staff: userForm.value.role === 'admin' || userForm.value.role === 'super_admin',
      is_superuser: userForm.value.role === 'super_admin'
    }
    
    if (editingUser.value) {
      // Mise à jour
      // Si le mot de passe est fourni, l'inclure
      if (userForm.value.password && userForm.value.password.trim()) {
        userData.password = userForm.value.password
      }
      await superAdminApi.users.update(editingUser.value.id, userData)
      dialogMessage.value = 'Utilisateur modifié avec succès !'
    } else {
      // Création (ajouter le mot de passe)
      const createData = {
        ...userData,
        password: userForm.value.password,
        password_confirm: userForm.value.password
      }
      await superAdminApi.users.create(createData)
      dialogMessage.value = 'Utilisateur créé avec succès !'
    }
    
    showAddModal.value = false
    showSuccessDialog.value = true
    await loadUsers()
  } catch (error) {
    // Gérer les erreurs de validation
    if (error.response?.data) {
      const errorData = error.response.data
      
      // Erreur de validation du mot de passe
      if (errorData.password) {
        const passwordErrors = Array.isArray(errorData.password) 
          ? errorData.password.join('\n') 
          : errorData.password
        dialogMessage.value = 'Erreur de validation du mot de passe'
        errorDetails.value = passwordErrors
      }
      // Autres erreurs de validation
      else if (errorData.detail) {
        dialogMessage.value = 'Erreur'
        errorDetails.value = errorData.detail
      }
      // Erreurs multiples
      else if (typeof errorData === 'object') {
        const errors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages.join(', ') : messages
            return `${field}: ${msg}`
          })
          .join('\n')
        dialogMessage.value = 'Erreurs de validation'
        errorDetails.value = errors
      }
      // Message générique
      else {
        dialogMessage.value = 'Une erreur est survenue'
        errorDetails.value = errorData.message || errorData.error || 'Erreur inconnue'
      }
    } else {
      dialogMessage.value = 'Une erreur est survenue'
      errorDetails.value = 'Impossible de sauvegarder l\'utilisateur'
    }
    
    showErrorDialog.value = true
  }
}

// Supprimer un utilisateur
const deleteUser = async (userId) => {
  const confirmed = await dialog.confirm(
    'Supprimer cet utilisateur',
    'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    'Cette action est irréversible.'
  )
  if (!confirmed) return
  
  try {
    await superAdminApi.users.delete(userId)
    toast.success('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès')
    await loadUsers()
  } catch (error) {
    toast.error(
      'Erreur de suppression',
      'Impossible de supprimer cet utilisateur',
      error.response?.data?.error || error.message
    )
  }
}

// Obtenir la couleur du rôle
const getRoleColor = (role) => {
  const roleObj = roles.find(r => r.value === role)
  return roleObj?.color || 'gray'
}

// Obtenir le label du rôle
const getRoleLabel = (role) => {
  const roleObj = roles.find(r => r.value === role)
  return roleObj?.label || role
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <Layout 
    titre="Gestion des Utilisateurs"
    description="Gérez les utilisateurs de l'application AdminSgStock"
  >
    <!-- Header avec bouton -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Liste des Utilisateurs</h2>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/50"
      >
        <UserPlus class="w-5 h-5" />
        <span class="font-medium">Nouvel utilisateur</span>
      </button>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-6">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Table des utilisateurs -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Utilisateur
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading" class="text-center">
              <td colspan="6" class="px-6 py-8">
                <div class="flex items-center justify-center gap-2 text-gray-500">
                  <div class="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {{ user.first_name?.[0] || user.username[0] }}{{ user.last_name?.[0] || '' }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
                    <div class="text-sm text-gray-500">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ user.email }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    getRoleColor(user.role) === 'red' ? 'bg-red-100 text-red-700' :
                    getRoleColor(user.role) === 'orange' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  ]"
                >
                  <Shield class="w-3 h-3" />
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  <component :is="user.is_active ? UserCheck : UserX" class="w-3 h-3" />
                  {{ user.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ user.last_login ? new Date(user.last_login).toLocaleString('fr-FR', { 
                  year: 'numeric', month: 'short', day: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                }) : 'Jamais' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(user)"
                    class="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Aucun utilisateur trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Ajout/Édition -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingUser ? 'Modifier' : 'Ajouter' }} un utilisateur
          </h2>
        </div>

        <!-- Form -->
        <div class="px-6 py-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                v-model="userForm.first_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="userForm.last_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              v-model="userForm.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="userForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe' }}
            </label>
            <input
              v-model="userForm.password"
              type="password"
              :placeholder="editingUser ? 'Laisser vide pour ne pas changer' : 'Minimum 8 caractères'"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              v-model="userForm.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option v-for="role in roles" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="userForm.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label for="is_active" class="text-sm font-medium text-gray-700">
              Utilisateur actif
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="openConfirmDialog"
            class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/50"
          >
            {{ editingUser ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog de confirmation -->
    <div v-if="showConfirmDialog" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
         @click.self="showConfirmDialog = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <AlertTriangle class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white">Confirmation</h3>
          </div>
          <button @click="showConfirmDialog = false" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700 text-base mb-6">{{ dialogMessage }}</p>
          <div class="flex gap-3 justify-end">
            <button @click="showConfirmDialog = false" 
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Annuler
            </button>
            <button @click="saveUser" 
                    class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog de succès -->
    <div v-if="showSuccessDialog" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
         @click.self="showSuccessDialog = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <CheckCircle class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white">Succès</h3>
          </div>
          <button @click="showSuccessDialog = false" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700 text-base mb-6">{{ dialogMessage }}</p>
          <div class="flex justify-end">
            <button @click="showSuccessDialog = false" 
                    class="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog d'erreur -->
    <div v-if="showErrorDialog" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
         @click.self="showErrorDialog = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <AlertTriangle class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white">{{ dialogMessage }}</h3>
          </div>
          <button @click="showErrorDialog = false" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700 text-base whitespace-pre-line mb-6">{{ errorDetails }}</p>
          <div class="flex justify-end">
            <button @click="showErrorDialog = false" 
                    class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
