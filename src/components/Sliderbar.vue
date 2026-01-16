<script setup>
import { ref, computed } from 'vue'
import logo from './../assets/images/OBJECTS.png'
import { 
  LayoutDashboard, Users, Monitor, DollarSign, HeadphonesIcon, Settings,
  ChevronLeft, ChevronRight, UserCog, Mail
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'blue' },
  { name: 'Entreprises', icon: Users, path: '/clients', color: 'green' },
  { name: 'Utilisateurs', icon: UserCog, path: '/users', color: 'indigo' },
  { name: 'Messages Contact', icon: Mail, path: '/contact-messages', color: 'pink', badge: true },
  // { name: 'Monitoring', icon: Monitor, path: '/monitoring', color: 'purple' },
  { name: 'Facturation', icon: DollarSign, path: '/billing', color: 'yellow' },
  // { name: 'Support', icon: HeadphonesIcon, path: '/support', color: 'orange' },
  { name: 'Paramètres', icon: Settings, path: '/settings', color: 'gray' },
]

// Vérifier si un item est actif
const isActive = (path) => {
  return route.path === path
}

// Obtenir les classes de couleur selon l'item
const getColorClasses = (color, active) => {
  const colors = {
    blue: active 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50' 
      : 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-400',
    green: active 
      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50' 
      : 'text-gray-400 hover:bg-green-500/10 hover:text-green-400',
    indigo: active 
      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/50' 
      : 'text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-400',
    pink: active 
      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/50' 
      : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-400',
    purple: active 
      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50' 
      : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400',
    yellow: active 
      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50' 
      : 'text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400',
    orange: active 
      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50' 
      : 'text-gray-400 hover:bg-orange-500/10 hover:text-orange-400',
    gray: active 
      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/50' 
      : 'text-gray-400 hover:bg-gray-500/10 hover:text-gray-400',
  }
  return colors[color] || colors.gray
}
</script>

<template>
  <!-- SIDEBAR avec design modernisé -->
  <aside
    class="bg-gradient-to-b from-gray-900 via-gray-900 to-black flex flex-col justify-between transition-all duration-300 border-r border-gray-800"
    :class="[
      // Mobile
      'w-[70px] sm:w-20',
      // Desktop
      isCollapsed ? 'md:w-20' : 'md:w-[280px]'
    ]"
  >

    <!-- HEADER -->
    <div class="flex flex-col gap-8 ml-0 py-6">

      <!-- LOGO + ADMIN -->
      <div class="flex flex-col gap-2 items-center px-3">

        <!-- LOGO avec effet hover -->
        <div class="transition-all duration-300 hover:scale-105 cursor-pointer">
          <img
            :src="logo"
            class="object-contain transition-all duration-300"
            :class="[
              'w-12 h-12 sm:w-14 sm:h-14',
              isCollapsed ? 'md:w-16 md:h-16'
                         : 'md:w-[130px] md:h-[70px]'
            ]"
          />
        </div>

        <!-- ADMIN TEXT avec badge -->
        <div
          v-if="!isCollapsed"
          class="hidden md:flex flex-col items-center gap-1 transition-all duration-300"
          :class="isCollapsed ? 'md:opacity-0 md:h-0' : 'md:opacity-100'"
        >
          <p class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-bold text-sm">
            SuperAdmin
          </p>
          <span class="px-3 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
            SG Stocks
          </span>
        </div>
      </div>

      <!-- Bouton toggle sidebar (desktop seulement) -->
      <button
        @click="toggleSidebar"
        class="hidden md:flex items-center justify-center mx-auto w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 border border-gray-700"
      >
        <component :is="isCollapsed ? ChevronRight : ChevronLeft" class="w-4 h-4" />
      </button>

      <!-- MENU -->
      <nav class="flex flex-col gap-2 px-3">
        <div
          v-for="item in menuItems"
          :key="item.path"
          @click="router.push(item.path)"
          :class="[
            'flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative',
            getColorClasses(item.color, isActive(item.path)),
            isActive(item.path) ? 'scale-105' : 'scale-100 hover:scale-105'
          ]"
        >
          <!-- Indicateur actif (barre gauche) -->
          <div
            v-if="isActive(item.path)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
          ></div>

          <!-- Icon avec animation -->
          <component 
            :is="item.icon" 
            :class="[
              'transition-all duration-200',
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5',
              isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
            ]"
          />

          <!-- Title avec animation -->
          <span
            v-if="!isCollapsed"
            class="whitespace-nowrap hidden md:block font-medium transition-all duration-200"
            :class="isActive(item.path) ? 'font-bold' : 'font-medium'"
          >
            {{ item.name }}
          </span>

          <!-- Badge notifications (exemple) -->
          <span
            v-if="!isCollapsed && (item.badge || (item.name === 'Support' && !isActive(item.path)))"
            class="hidden md:block ml-auto px-2 py-0.5 text-white text-xs font-bold rounded-full animate-pulse"
            :class="item.name === 'Messages Contact' ? 'bg-pink-500' : 'bg-red-500'"
          >
            {{ item.name === 'Messages Contact' ? 'New' : '3' }}
          </span>
        </div>
      </nav>
    </div>

    <!-- FOOTER amélioré -->
    <footer class="px-3 pb-6 transition-all duration-300 hidden sm:block">
      <div
        v-if="!isCollapsed"
        class="hidden md:block p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
            SA
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm truncate">SuperAdmin</p>
            <p class="text-gray-400 text-xs truncate">admin@sgstocks.com</p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connecté</span>
        </div>
      </div>
      
      <!-- Version compacte quand collapsed -->
      <div
        v-else
        class="hidden md:flex items-center justify-center"
      >
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
          SA
        </div>
      </div>
    </footer>

  </aside>
</template>
