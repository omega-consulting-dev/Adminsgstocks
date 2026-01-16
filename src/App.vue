<script setup>
import { ref } from 'vue';
import logo from './../src/assets/images/OBJECTS.png'
import ToastContainer from './components/ToastContainer.vue'

import {
  Search,
  UserCircle,
  Bell,
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Settings,
  Building2,
  TrendingUp
} from 'lucide-vue-next'
const searchQuery = ref("")


const dashboardCards = [
  {
    icon: Building2,
    number: 41,
    label: "Entreprises Actives",
    selectOptions: ["Actif", "Inactif"],
    bg: "bg-blue-100",
    text: "text-blue-500",
    footer: null // 👉 pas de footer
  },
  {
    icon: Package,
    number: 12,
    label: "Packs expirant sous 7 jours",
    selectOptions: ["Tous", "Actifs", "Expirés"],
    bg: "bg-green-100",
    text: "text-green-500",
    footer: {
      type: "multi",
      items: [
        { value: "3", label: "3 jours" },
        { value: "7", label: "7 jours" },
        { value: "30", label: "30 jours" }
      ]
    }
  },
  {
    icon: TrendingUp,
    number: "XAF 540 000",
    label: "Revenus du mois",
    selectOptions: ["Mensuel", "Annuel"],
    bg: "bg-yellow-100",
    text: "text-yellow-500",
    footer: {
      type: "single",
      text: "Derniers 12 mois · Détails des paiements"
    }
  }
]
// état pour ouvrir / réduire le menu
const isCollapsed = ref(true)

// fonction toggle
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}


</script>

<template>
  <RouterView/>
  <ToastContainer />
</template>
