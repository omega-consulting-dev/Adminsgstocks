<script setup>
import Layout from './../components/Layout.vue'
import { Package, Edit2, Power, Trash2, MoreVertical, Plus, Check } from 'lucide-vue-next'
import { ref } from 'vue'
import { useDialog } from '../composables/useDialog'
import { useToast } from '../composables/useToast'

const dialog = useDialog()
const toast = useToast()

const showModal = ref(false)
const editingPack = ref(null)

const packs = ref([
  {
    id: 1,
    name: "Démarrage simple",
    badge: null,
    badgeColor: null,
    savings: "23",
    oldPrice: "19 450",
    price: "15 000",
    maxPoints: 1,
    maxAdmins: 3,
    status: "Limité",
    active: false,
    icon: Package,
    bg: "bg-orange-100",
    iconColor: "text-orange-500",
    features: [
      "Pour 1 point de vente maxi",
      "Pour 3 utilisateurs admin max",
      "Suivre les revenus et les dépenses",
      "Envoyer un nombre illimité de factures",
      "Gestion 01 magasin",
      "Stocks, produits, services",
      "Gestion des dépenses",
      "Suivre vos statistiques"
    ]
  },
  {
    id: 2,
    name: "Professionnel",
    badge: "Populaire",
    badgeColor: "bg-blue-600 text-white",
    savings: "20",
    oldPrice: "50 000",
    price: "40 000",
    maxPoints: 5,
    maxAdmins: 7,
    status: "Limité",
    active: true,
    icon: Package,
    bg: "bg-blue-100",
    iconColor: "text-blue-500",
    features: [
      "Pour 5 points de vente maxi",
      "Pour 7 utilisateurs admin max",
      "Suivre les revenus et les dépenses",
      "Envoyer un nombre illimité de factures",
      "Gestion 05 magasin",
      "Stocks, produits, services",
      "Encaissement, décaissement",
      "Gestion des emprunts",
      "Gestion des dépenses"
    ]
  },
  {
    id: 3,
    name: "Avancé",
    badge: "Actif",
    badgeColor: "bg-green-100 text-green-700",
    savings: "25",
    oldPrice: "80 000",
    price: "60 000",
    maxPoints: 15,
    maxAdmins: 15,
    status: "Actif",
    active: true,
    icon: Package,
    bg: "bg-green-100",
    iconColor: "text-green-500",
    features: [
      "Pour 15 points de vente maxi",
      "Pour 15 utilisateurs admin max",
      "Suivre les revenus et les dépenses",
      "Envoyer un nombre illimité de factures",
      "Stocks, produits, services",
      "Encaissement, décaissement",
      "Gestion des emprunts",
      "Gestion des dépenses",
      "Mouvement stocks",
      "Suivre vos statistiques"
    ]
  }
])

const formData = ref({
  name: '',
  badge: '',
  oldPrice: '',
  price: '',
  savings: '',
  maxPoints: '',
  maxAdmins: '',
  status: 'Actif',
  selectedFeatures: [],
  description: ''
})

const availableFeatures = ref([
  { id: 1, text: "Suivre les revenus et les dépenses" },
  { id: 2, text: "Envoyer un nombre illimité de factures" },
  { id: 3, text: "Pour un seul point de vente" },
  { id: 4, text: "Pour 03 utilisateur admin max" },
  { id: 5, text: "Pour 05 utilisateur admin max" },
  { id: 6, text: "Pour 07 utilisateur admin max" },
  { id: 7, text: "Pour 15 points de vente maxi" },
  { id: 8, text: "Gestion 01 magasin" },
  { id: 9, text: "Gestion 05 magasin" },
  { id: 10, text: "Stocks, produits, services" },
  { id: 11, text: "Encaissement, décaissement" },
  { id: 12, text: "Gestion des emprunts" },
  { id: 13, text: "Gestion des dépenses" },
  { id: 14, text: "Mouvement stocks" },
  { id: 15, text: "Suivre vos statistiques" }
])

const openModal = (pack = null) => {
  if (pack) {
    editingPack.value = pack
    formData.value = {
      name: pack.name,
      badge: pack.badge || '',
      oldPrice: pack.oldPrice,
      price: pack.price,
      savings: pack.savings,
      maxPoints: pack.maxPoints,
      maxAdmins: pack.maxAdmins,
      status: pack.status,
      selectedFeatures: [],
      description: ''
    }
  } else {
    editingPack.value = null
    formData.value = {
      name: '',
      badge: '',
      oldPrice: '',
      price: '',
      savings: '',
      maxPoints: '',
      maxAdmins: '',
      status: 'Actif',
      selectedFeatures: [],
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingPack.value = null
}

const savePack = () => {
  if (editingPack.value) {
    const index = packs.value.findIndex(p => p.id === editingPack.value.id)
    if (index !== -1) {
      packs.value[index] = {
        ...packs.value[index],
        name: formData.value.name,
        badge: formData.value.badge,
        oldPrice: formData.value.oldPrice,
        price: formData.value.price,
        savings: formData.value.savings,
        maxPoints: formData.value.maxPoints,
        maxAdmins: formData.value.maxAdmins,
        status: formData.value.status
      }
    }
  } else {
    const newPack = {
      id: Date.now(),
      name: formData.value.name,
      badge: formData.value.badge,
      badgeColor: formData.value.badge === 'Populaire' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700',
      savings: formData.value.savings,
      oldPrice: formData.value.oldPrice,
      price: formData.value.price,
      maxPoints: formData.value.maxPoints,
      maxAdmins: formData.value.maxAdmins,
      status: formData.value.status,
      active: formData.value.status === 'Actif',
      icon: Package,
      bg: "bg-purple-100",
      iconColor: "text-purple-500",
      features: formData.value.selectedFeatures.map(id => {
        const feature = availableFeatures.value.find(f => f.id === id)
        return feature.text
      })
    }
    packs.value.push(newPack)
  }
  closeModal()
}

const togglePack = (id) => {
  const pack = packs.value.find(p => p.id === id)
  if (pack) {
    pack.active = !pack.active
  }
}

const deletePack = async (id) => {
  const confirmed = await dialog.confirm(
    'Supprimer ce pack',
    'Êtes-vous sûr de vouloir supprimer ce pack d\'abonnement ?',
    'Cette action est irréversible.'
  )
  if (confirmed) {
    packs.value = packs.value.filter(p => p.id !== id)
    toast.success('Pack supprimé', 'Le pack d\'abonnement a été supprimé avec succès')
  }
}
</script>

<template>
  <Layout titre="Gestion des Packs" description="Liste des abonnements disponibles">
    
    <article class="">
      
      <!-- Bouton Ajouter en haut à droite -->
      <div class="flex justify-end mt-6">
        <button 
          @click="openModal()"
          class="flex items-center gap-2 rounded-[10px] bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus :size="20" />
          Ajouter un pack
        </button>
      </div>

      <!-- Grille des packs -->
      <main class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        
        <div 
          v-for="pack in packs" 
          :key="pack.id"
          class="flex flex-col rounded-[10px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          
          <!-- Entête de la card -->
          <div class="flex justify-between items-start px-5 pt-5">
            <div class="flex items-start gap-3">
              <div :class="['w-10 h-10 rounded-[10px] flex items-center justify-center', pack.bg]">
                <component :is="pack.icon" :class="['w-5 h-5', pack.iconColor]" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ pack.name }}</h3>
                  <span 
                    v-if="pack.badge" 
                    :class="pack.badgeColor"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ pack.badge }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Économisez jusqu'à {{ pack.savings }} FCFA/mois</p>
              </div>
            </div>
            
            <!-- Menu actions -->
            <div class="relative group">
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical :size="18" class="text-gray-600" />
              </button>
              
              <!-- Dropdown menu -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button 
                  @click="openModal(pack)"
                  class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 :size="16" />
                  Modifier
                </button>
                <button 
                  @click="togglePack(pack.id)"
                  class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Power :size="16" :class="pack.active ? 'text-green-600' : 'text-gray-400'" />
                  {{ pack.active ? 'Désactiver' : 'Activer' }}
                </button>
                <button 
                  @click="deletePack(pack.id)"
                  class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 :size="16" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Prix -->
          <div class="px-5 mt-4">
            <div class="text-sm text-gray-400 line-through">{{ pack.oldPrice }} FCFA</div>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-[30px] font-semibold text-gray-900">{{ pack.price }}</span>
              <span class="text-gray-600 text-sm">FCFA/mois</span>
            </div>
          </div>

          <!-- Badge statut -->
          <div class="px-5 mt-3">
            <span 
              :class="{
                'bg-green-100 text-green-700': pack.status === 'Actif',
                'bg-orange-100 text-orange-700': pack.status === 'Limité',
                'bg-gray-100 text-gray-700': pack.status === 'Désactivé'
              }"
              class="inline-block px-3 py-1 rounded-lg text-xs font-medium"
            >
              {{ pack.status }}
            </span>
          </div>

          <!-- Ligne de séparation -->
          <hr class="w-full h-px bg-gray-200 my-4 mx-5" style="width: calc(100% - 2.5rem);" />

          <!-- Fonctionnalités -->
          <div class="px-5 flex-1">
            <div class="space-y-2">
              <div 
                v-for="(feature, idx) in pack.features.slice(0, 6)" 
                :key="idx"
                class="flex items-start gap-2"
              >
                <Check :size="16" class="text-blue-600 mt-0.5 flex-shrink-0" />
                <span class="text-[13px] text-gray-700">{{ feature }}</span>
              </div>
              <p v-if="pack.features.length > 6" class="text-xs text-blue-600 mt-2">
                + {{ pack.features.length - 6 }} autres fonctionnalités
              </p>
            </div>
          </div>

          <!-- Footer avec bouton -->
          <div class="px-5 pb-5 mt-4">
            <button 
              class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-[10px] transition-colors text-sm"
            >
              Essai gratuit pendant 14 jours
            </button>
            <p class="text-center text-xs text-gray-500 mt-2">Carte de crédit non requise</p>
          </div>

        </div>

      </main>

    </article>

    <!-- Modale Ajouter/Modifier -->
    <div 
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-[10px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        
        <!-- En-tête modale -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingPack ? 'Modifier le pack' : 'Ajouter un pack' }}
          </h2>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu modale scrollable -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <form @submit.prevent="savePack" class="space-y-5">
            
            <!-- Grille 2 colonnes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pack <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.name"
                  type="text"
                  placeholder="Ex: Pack Professionnel"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Badge (optionnel)
                </label>
                <input 
                  v-model="formData.badge"
                  type="text"
                  placeholder="Ex: Populaire"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix initial (FCFA) <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.oldPrice"
                  type="text"
                  placeholder="50000"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix promotionnel (FCFA) <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.price"
                  type="text"
                  placeholder="40000"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Économies (FCFA) <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.savings"
                  type="text"
                  placeholder="20"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de points de vente <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.maxPoints"
                  type="number"
                  placeholder="5"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'utilisateurs admin max <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.maxAdmins"
                  type="number"
                  placeholder="3"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Statut <span class="text-red-500">*</span>
                </label>
                <select 
                  v-model="formData.status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="Actif">Actif</option>
                  <option value="Limité">Limité</option>
                  <option value="Désactivé">Désactivé</option>
                </select>
              </div>
            </div>

            <!-- Fonctionnalités -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fonctionnalités <span class="text-red-500">*</span>
              </label>
              <div class="border border-gray-300 rounded-[10px] p-4 max-h-52 overflow-y-auto space-y-2.5 bg-gray-50">
                <label 
                  v-for="feature in availableFeatures" 
                  :key="feature.id"
                  class="flex items-start gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                >
                  <input 
                    type="checkbox"
                    :value="feature.id"
                    v-model="formData.selectedFeatures"
                    class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">{{ feature.text }}</span>
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                {{ formData.selectedFeatures.length }} fonctionnalité(s) sélectionnée(s)
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea 
                v-model="formData.description"
                rows="3"
                placeholder="Description du pack..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              ></textarea>
            </div>

          </form>
        </div>

        <!-- Footer modale -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button 
            @click="closeModal"
            type="button"
            class="px-5 py-2.5 border border-gray-300 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Annuler
          </button>
          <button 
            @click="savePack"
            type="button"
            class="px-5 py-2.5 bg-blue-600 text-white rounded-[10px] font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            {{ editingPack ? 'Enregistrer' : 'Créer le pack' }}
          </button>
        </div>

      </div>
    </div>

  </Layout>
</template>

<style scoped>
/* Style pour le scrollbar personnalisé */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>