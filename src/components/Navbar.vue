<script setup>
import { ref } from 'vue'
import { UserCircle, Bell, CreditCard, LogOut, AlertTriangle, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)
const showLogoutDialog = ref(false)

const props = defineProps({
  titre: {
    type: String,
    required: false,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const openLogoutDialog = () => {
  showUserMenu.value = false
  showLogoutDialog.value = true
}

const confirmLogout = () => {
  // Supprimer le token d'authentification
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  
  showLogoutDialog.value = false
  
  // Rediriger vers la page de connexion
  router.push('/')
}

const cancelLogout = () => {
  showLogoutDialog.value = false
}
</script>

<template>
  <header class="bg-white h-fit py-5 flex justify-between items-center px-4 shadow-sm">

    <!-- GAUCHE -->
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <CreditCard class="w-6 text-gray-800" />
        <p class="font-semibold text-gray-800 hidden sm:block">{{ props.titre }}</p>
      </div>
      <p class="text-sm text-gray-500 ml-8 -mt-1 hidden sm:block">{{props.description}}</p>
    </div>
     <!-- section de gauche -->
        <main class="flex items-center gap-5 pr-10 ">
          <!-- cloche -->
          <div class="flex items-center relative">
            <bell class="size-6 text-gray-600" />
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          <!-- personne icone avec menu déroulant -->
          <div class="relative">
            <button @click="toggleUserMenu" class="focus:outline-none">
              <UserCircle class="size-8 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" />
            </button>

            <!-- Menu déroulant -->
            <div v-if="showUserMenu" 
                 class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button @click="openLogoutDialog" 
                      class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors">
                <LogOut class="size-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </main>
  </header>

  <!-- Dialog de confirmation de déconnexion -->
  <div v-if="showLogoutDialog" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
       @click.self="cancelLogout">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white bg-opacity-20 p-2 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-bold text-white">Confirmation de déconnexion</h3>
        </div>
        <button @click="cancelLogout" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <p class="text-gray-700 text-base mb-6">
          Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à nouveau à votre espace.
        </p>

        <!-- Actions -->
        <div class="flex gap-3 justify-end">
          <button @click="cancelLogout" 
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Annuler
          </button>
          <button @click="confirmLogout" 
                  class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2">
            <LogOut class="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
