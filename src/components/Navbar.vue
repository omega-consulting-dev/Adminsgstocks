<script setup>
import { ref } from 'vue'
import { UserCircle, Bell, CreditCard, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)

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

const logout = () => {
  // Supprimer le token d'authentification
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Rediriger vers la page de connexion
  router.push('/')
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
              <button @click="logout" 
                      class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors">
                <LogOut class="size-4" />
                Se déconnecter
              </button>
            </div>
          </div>
       

        </main>

  </header>
</template>
