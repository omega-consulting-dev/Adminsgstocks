<template>
  <Layout 
    titre="Gestion des Entreprises"
    description="Administration complète des tenants"
  >
    <div class="p-8 space-y-8">

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <RefreshCw class="w-12 h-12 animate-spin text-blue-600" />
          <span class="text-xl font-medium text-gray-700">Chargement des entreprises...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-red-900 mb-1">Erreur de chargement</h3>
            <p class="text-sm text-red-700 mb-3">{{ error }}</p>
            <button @click="loadCompanies" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
              <RefreshCw class="w-4 h-4 inline mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <template v-else>

        <!-- Header avec design amélioré -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold mb-2">Gestion des Entreprises</h1>
              <div class="flex items-center gap-4 text-blue-100">
                <div class="flex items-center gap-2">
                  <Building2 class="w-5 h-5" />
                  <span class="font-medium">{{ totalCompanies }} entreprises enregistrées</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle class="w-5 h-5" />
                  <span class="font-medium">{{ activeCompanies }} actives</span>
                </div>
              </div>
            </div>
            <button @click="showCreateModal = true" 
                    class="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              <Plus class="w-5 h-5" />
              Nouvelle Entreprise
            </button>
          </div>
        </div>

        <!-- Stats Cards avec design modernisé -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Total
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Entreprises</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalCompanies }}</p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Actives
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Entreprises Actives</p>
              <p class="text-3xl font-bold text-gray-900">{{ activeCompanies }}</p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                <XCircle class="w-7 h-7 text-white" />
              </div>
              <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                Inactives
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Entreprises Suspendues</p>
              <p class="text-3xl font-bold text-gray-900">{{ suspendedCompanies }}</p>
            </div>
          </div>
        </div>

        <!-- Filters and Search avec design amélioré -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="searchQuery" 
                     type="text" 
                     placeholder="Rechercher par nom, domaine ou email..." 
                     class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
            </div>
            <div class="flex gap-3">
              <select v-model="statusFilter" 
                      class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium">
                <option value="">Tous les statuts</option>
                <option value="active">✓ Actif</option>
                <option value="suspended">✗ Suspendu</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Companies Table avec design modernisé -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Utilisateurs
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="company in filteredCompanies" :key="company.id" class="hover:bg-blue-50/50 transition-colors duration-150">
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="shrink-0 h-12 w-12">
                        <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                          <Building2 class="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-bold text-gray-900">{{ company.name }}</div>
                        <div class="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">{{ company.schema_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <span :class="[
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm',
                      company.is_active 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    ]">
                      <component :is="company.is_active ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
                      {{ company.is_active ? 'Actif' : 'Suspendu' }}
                    </span>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center text-sm font-semibold text-gray-900">
                        {{ company.users_count || 0 }} / {{ company.max_users }}
                      </div>
                      <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" 
                             :style="{width: `${Math.min(100, (company.users_count || 0) / company.max_users * 100)}%`}"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      {{ company.plan_name || 'Standard' }}
                    </span>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {{ formatDate(company.created_on) }}
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="flex items-center justify-center gap-2">
                      <button @click="viewCompany(company)" 
                              title="Voir les détails"
                              class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <Eye class="w-4 h-4" />
                      </button>
                      <button @click="editCompany(company)" 
                              title="Modifier"
                              class="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button @click="toggleCompanyStatus(company)" 
                              :title="company.is_active ? 'Suspendre' : 'Activer'"
                              :class="[
                                'p-2 rounded-lg transition-colors',
                                company.is_active 
                                  ? 'text-orange-600 hover:bg-orange-100' 
                                  : 'text-green-600 hover:bg-green-100'
                              ]">
                        <component :is="company.is_active ? Pause : Play" class="w-4 h-4" />
                      </button>
                      <button 
                        @click="toggleCompanyStatus(company)" 
                        :title="company.is_suspended ? 'Activer l\'entreprise' : 'Désactiver l\'entreprise'"
                        :class="[
                          'p-2 rounded-lg transition-colors',
                          company.is_suspended 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-red-600 hover:bg-red-100'
                        ]">
                        <component :is="company.is_suspended ? CheckCircle : XCircle" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination améliorée -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="text-sm font-medium text-gray-700">
              Affichage de <span class="font-bold text-blue-600">{{ ((currentPage - 1) * pageSize) + 1 }}</span> à 
              <span class="font-bold text-blue-600">{{ Math.min(currentPage * pageSize, totalCompanies) }}</span> sur 
              <span class="font-bold text-blue-600">{{ totalCompanies }}</span> entreprises
            </div>
            <div class="flex items-center gap-2">
              <button @click="currentPage--" 
                      :disabled="currentPage === 1"
                      class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all">
                ← Précédent
              </button>
              <span class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md">{{ currentPage }}</span>
              <button @click="currentPage++" 
                      :disabled="currentPage * pageSize >= totalCompanies"
                      class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all">
                Suivant →
              </button>
            </div>
          </div>
        </div>

      </template>

      <!-- Modal Création Entreprise -->
      <div v-if="showCreateModal" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           @click.self="showCreateModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header Modal -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Nouvelle Entreprise</h2>
                <p class="text-blue-100 text-sm mt-1">Créer un nouveau tenant avec son administrateur</p>
              </div>
              <button @click="showCreateModal = false" 
                      class="w-10 h-10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
                <XCircle class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="createCompany" class="p-6 space-y-6">
            
            <!-- Section: Informations de base -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Building2 class="w-5 h-5 text-blue-600" />
                Informations de l'entreprise
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.name" 
                         type="text" 
                         required
                         placeholder="Ex: Entreprise ABC"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Sous-domaine <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <input v-model="formData.subdomain" 
                           type="text" 
                           required
                           placeholder="entreprise-abc"
                           pattern="[a-z0-9\-]+"
                           title="Lettres minuscules, chiffres et tirets uniquement"
                           class="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <span class="text-sm text-gray-500">.sgstocks.com</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Lettres minuscules, chiffres et tirets uniquement</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.email" 
                         type="email" 
                         required
                         placeholder="contact@entreprise.com"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input v-model="formData.phone" 
                         type="tel" 
                         placeholder="+237 6XX XXX XXX"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input v-model="formData.address" 
                         type="text" 
                         placeholder="Adresse complète"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Plan <span class="text-red-500">*</span>
                  </label>
                  <select v-model="formData.plan" 
                          required
                          @change="onPlanChange"
                          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option value="starter">Starter - 15 000 XAF/mois (Utilisateurs illimités, 1 point de vente)</option>
                    <option value="business">Business - 25 000 XAF/mois (Utilisateurs illimités, 1 PV + 1 magasin)</option>
                    <option value="enterprise">Enterprise - 50 000 XAF/mois (Tout illimité)</option>
                    <option value="custom">Personnalisé - Prix sur mesure</option>
                  </select>
                </div>

                <!-- Champ prix personnalisé (visible uniquement pour plan custom) -->
                <div v-if="formData.plan === 'custom'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prix mensuel personnalisé <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input v-model.number="formData.monthly_price" 
                           type="number" 
                           step="0.01"
                           min="0"
                           :required="formData.plan === 'custom'"
                           placeholder="Ex: 50000"
                           class="w-full px-4 py-2.5 pr-20 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">XAF</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Définissez un prix mensuel personnalisé pour cette entreprise</p>
                </div>
              </div>
            </div>

            <!-- Section: Compte Administrateur -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Users class="w-5 h-5 text-green-600" />
                Compte Administrateur
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.admin_username" 
                         type="text" 
                         required
                         placeholder="admin"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email Admin <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.admin_email" 
                         type="email" 
                         required
                         placeholder="admin@entreprise.com"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input v-model="formData.admin_first_name" 
                         type="text" 
                         placeholder="Prénom"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input v-model="formData.admin_last_name" 
                         type="text" 
                         placeholder="Nom"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.admin_password" 
                         type="password" 
                         required
                         minlength="8"
                         placeholder="Minimum 8 caractères"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  <p class="text-xs text-gray-500 mt-1">Le mot de passe doit contenir au moins 8 caractères</p>
                </div>
              </div>
            </div>

            <!-- Section: Modules -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Settings class="w-5 h-5 text-purple-600" />
                Modules et Fonctionnalités
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_services" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Module Services</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_multi_store" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Multi-Magasins</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_loans" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Gestion Prêts</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_advanced_analytics" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Analytics Avancées</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_api_access" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Accès API</span>
                </label>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div v-if="createError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div class="flex items-start gap-3">
                <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-red-900">Erreur lors de la création</p>
                  <p class="text-sm text-red-700 mt-1">{{ createError }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t">
              <button type="button" 
                      @click="showCreateModal = false"
                      class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                Annuler
              </button>
              <button type="submit" 
                      :disabled="creating"
                      class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw v-if="creating" class="w-5 h-5 animate-spin" />
                <CheckCircle v-else class="w-5 h-5" />
                {{ creating ? 'Création en cours...' : 'Créer l\'entreprise' }}
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Modal Détails Entreprise -->
      <div v-if="showDetailsModal && selectedCompany" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           @click.self="showDetailsModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">{{ selectedCompany.name }}</h2>
                <p class="text-blue-100 text-sm mt-1">{{ selectedCompany.schema_name }}.sgstocks.com</p>
              </div>
              <button @click="showDetailsModal = false" 
                      class="w-10 h-10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
                <XCircle class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            
            <!-- Statut & Plan -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border-l-4 border-green-500">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 font-medium">Statut</p>
                    <p class="text-lg font-bold" :class="selectedCompany.is_active ? 'text-green-700' : 'text-red-700'">
                      {{ selectedCompany.is_active ? 'Active' : 'Suspendue' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border-l-4 border-purple-500">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <DollarSign class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 font-medium">Plan</p>
                    <p class="text-lg font-bold text-purple-700">{{ selectedCompany.plan_name || 'Standard' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations générales -->
            <div class="space-y-3">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Informations générales</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Nom de l'entreprise</p>
                  <p class="text-base font-semibold text-gray-900">{{ selectedCompany.name }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Schema</p>
                  <p class="text-base font-mono bg-gray-100 px-3 py-1 rounded text-gray-900">{{ selectedCompany.schema_name }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Email</p>
                  <p class="text-base text-gray-900">{{ selectedCompany.email || 'Non renseigné' }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Téléphone</p>
                  <p class="text-base text-gray-900">{{ selectedCompany.phone || 'Non renseigné' }}</p>
                </div>

                <div class="space-y-1 col-span-2">
                  <p class="text-sm text-gray-500 font-medium">Adresse</p>
                  <p class="text-base text-gray-900">{{ selectedCompany.address || 'Non renseignée' }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Date de création</p>
                  <p class="text-base text-gray-900">{{ formatDate(selectedCompany.created_on) }}</p>
                </div>
              </div>
            </div>

            <!-- Utilisation -->
            <div class="space-y-3">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Utilisation des ressources</h3>
              
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Utilisateurs</span>
                    <span class="text-sm font-bold text-gray-900">{{ selectedCompany.users_count || 0 }} / {{ selectedCompany.max_users }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-blue-600 h-3 rounded-full transition-all" 
                         :style="{width: `${Math.min(100, (selectedCompany.users_count || 0) / selectedCompany.max_users * 100)}%`}"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Points de vente</span>
                    <span class="text-sm font-bold text-gray-900">{{ selectedCompany.stores_count || 0 }} / {{ selectedCompany.max_stores }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-green-600 h-3 rounded-full transition-all" 
                         :style="{width: `${Math.min(100, (selectedCompany.stores_count || 0) / selectedCompany.max_stores * 100)}%`}"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Produits</span>
                    <span class="text-sm font-bold text-gray-900">{{ selectedCompany.products_count || 0 }} / {{ selectedCompany.max_products }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-purple-600 h-3 rounded-full transition-all" 
                         :style="{width: `${Math.min(100, (selectedCompany.products_count || 0) / selectedCompany.max_products * 100)}%`}"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modules activés -->
            <div class="space-y-3">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Modules et fonctionnalités</h3>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center gap-2 p-3 rounded-lg" :class="selectedCompany.feature_services ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                  <component :is="selectedCompany.feature_services ? CheckCircle : XCircle" 
                             :class="selectedCompany.feature_services ? 'text-green-600' : 'text-gray-400'" 
                             class="w-5 h-5" />
                  <span class="text-sm font-medium" :class="selectedCompany.feature_services ? 'text-green-900' : 'text-gray-500'">
                    Module Services
                  </span>
                </div>

                <div class="flex items-center gap-2 p-3 rounded-lg" :class="selectedCompany.feature_multi_store ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                  <component :is="selectedCompany.feature_multi_store ? CheckCircle : XCircle" 
                             :class="selectedCompany.feature_multi_store ? 'text-green-600' : 'text-gray-400'" 
                             class="w-5 h-5" />
                  <span class="text-sm font-medium" :class="selectedCompany.feature_multi_store ? 'text-green-900' : 'text-gray-500'">
                    Multi-Magasins
                  </span>
                </div>

                <div class="flex items-center gap-2 p-3 rounded-lg" :class="selectedCompany.feature_loans ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                  <component :is="selectedCompany.feature_loans ? CheckCircle : XCircle" 
                             :class="selectedCompany.feature_loans ? 'text-green-600' : 'text-gray-400'" 
                             class="w-5 h-5" />
                  <span class="text-sm font-medium" :class="selectedCompany.feature_loans ? 'text-green-900' : 'text-gray-500'">
                    Gestion Prêts
                  </span>
                </div>

                <div class="flex items-center gap-2 p-3 rounded-lg" :class="selectedCompany.feature_advanced_analytics ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                  <component :is="selectedCompany.feature_advanced_analytics ? CheckCircle : XCircle" 
                             :class="selectedCompany.feature_advanced_analytics ? 'text-green-600' : 'text-gray-400'" 
                             class="w-5 h-5" />
                  <span class="text-sm font-medium" :class="selectedCompany.feature_advanced_analytics ? 'text-green-900' : 'text-gray-500'">
                    Analytics Avancées
                  </span>
                </div>

                <div class="flex items-center gap-2 p-3 rounded-lg" :class="selectedCompany.feature_api_access ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                  <component :is="selectedCompany.feature_api_access ? CheckCircle : XCircle" 
                             :class="selectedCompany.feature_api_access ? 'text-green-600' : 'text-gray-400'" 
                             class="w-5 h-5" />
                  <span class="text-sm font-medium" :class="selectedCompany.feature_api_access ? 'text-green-900' : 'text-gray-500'">
                    Accès API
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t">
              <button @click="showDetailsModal = false"
                      class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                Fermer
              </button>
              <button @click="showDetailsModal = false; editCompany(selectedCompany)"
                      class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all">
                <Edit class="w-5 h-5" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Édition Entreprise -->
      <div v-if="showEditModal && selectedCompany" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           @click.self="showEditModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Modifier {{ selectedCompany.name }}</h2>
                <p class="text-yellow-100 text-sm mt-1">Mettre à jour les informations de l'entreprise</p>
              </div>
              <button @click="showEditModal = false" 
                      class="w-10 h-10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
                <XCircle class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="saveCompanyChanges" class="p-6 space-y-6">
            
            <!-- Informations de base -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Building2 class="w-5 h-5 text-blue-600" />
                Informations de base
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700">Nom de l'entreprise *</label>
                  <input v-model="formData.name" 
                         type="text" 
                         required
                         placeholder="Ex: Ma Super Entreprise"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700">Sous-domaine *</label>
                  <div class="relative">
                    <input v-model="formData.subdomain" 
                           type="text" 
                           required
                           disabled
                           pattern="[a-z0-9-]+"
                           class="w-full px-4 py-2.5 pr-32 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed">
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">.sgstocks.com</span>
                  </div>
                  <p class="text-xs text-gray-500">Le sous-domaine ne peut pas être modifié</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700">Email principal *</label>
                  <input v-model="formData.email" 
                         type="email" 
                         required
                         placeholder="contact@entreprise.com"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700">Téléphone</label>
                  <input v-model="formData.phone" 
                         type="tel" 
                         placeholder="+237 6XX XXX XXX"
                         class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-semibold text-gray-700">Adresse</label>
                  <textarea v-model="formData.address" 
                            rows="2" 
                            placeholder="Adresse complète de l'entreprise"
                            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all resize-none"></textarea>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700">Plan d'abonnement *</label>
                  <select v-model="formData.plan" 
                          required
                          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all">
                    <option value="starter">Starter - 3 utilisateurs, 1 magasin</option>
                    <option value="business">Business - 10 utilisateurs, 3 magasins</option>
                    <option value="enterprise">Enterprise - 25 utilisateurs, 10 magasins</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Modules -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Settings class="w-5 h-5 text-purple-600" />
                Modules et Fonctionnalités
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_services" type="checkbox" class="w-5 h-5 text-yellow-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Module Services</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_multi_store" type="checkbox" class="w-5 h-5 text-yellow-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Multi-Magasins</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_loans" type="checkbox" class="w-5 h-5 text-yellow-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Gestion Prêts</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_advanced_analytics" type="checkbox" class="w-5 h-5 text-yellow-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Analytics Avancées</span>
                </label>

                <label class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input v-model="formData.feature_api_access" type="checkbox" class="w-5 h-5 text-yellow-600 rounded">
                  <span class="text-sm font-medium text-gray-700">Accès API</span>
                </label>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div v-if="editError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div class="flex items-start gap-3">
                <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-red-900">Erreur lors de la modification</p>
                  <p class="text-sm text-red-700 mt-1">{{ editError }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t">
              <button type="button" 
                      @click="showEditModal = false"
                      class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                Annuler
              </button>
              <button type="submit" 
                      :disabled="editing"
                      class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw v-if="editing" class="w-5 h-5 animate-spin" />
                <CheckCircle v-else class="w-5 h-5" />
                {{ editing ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from './../components/Layout.vue'
import {
  Building2, Plus, RefreshCw, AlertTriangle, CheckCircle, 
  XCircle, DollarSign, Eye, Edit, Pause, Play, Trash2, Settings, Users
} from 'lucide-vue-next'
import { superAdminApi } from '../services/superadmin-api'
import { useToast } from '../composables/useToast'
import { useDialog } from '../composables/useDialog'

const toast = useToast()
const dialog = useDialog()

// État réactif
const companies = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref(null)

// Métriques du backend
const dashboardMetrics = ref({
  monthly_revenue: 0,
  total_revenue: 0,
  active_companies: 0,
  total_companies: 0
})

// Modals de détails et édition
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedCompany = ref(null)
const editing = ref(false)
const editError = ref(null)

// Données du formulaire
const formData = ref({
  name: '',
  subdomain: '',
  email: '',
  phone: '',
  address: '',
  plan: 'starter',
  monthly_price: null,
  admin_username: '',
  admin_email: '',
  admin_password: '',
  admin_first_name: '',
  admin_last_name: '',
  feature_services: false,
  feature_multi_store: false,
  feature_loans: false,
  feature_advanced_analytics: false,
  feature_api_access: false
})

// Computed properties
const totalCompanies = computed(() => companies.value.length)

const activeCompanies = computed(() => 
  companies.value.filter(c => c.is_active).length
)

const suspendedCompanies = computed(() => 
  companies.value.filter(c => !c.is_active).length
)

const filteredCompanies = computed(() => {
  let filtered = companies.value

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(company => 
      company.name.toLowerCase().includes(query) ||
      company.schema_name.toLowerCase().includes(query)
    )
  }

  // Filtre par statut
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(c => c.is_active && !c.is_suspended)
  } else if (statusFilter.value === 'suspended') {
    filtered = filtered.filter(c => c.is_suspended)
  }

  // Pagination
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// Méthodes API
const loadCompanies = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Charger les entreprises depuis l'API SuperAdmin
    const response = await superAdminApi.companies.list()
    companies.value = response.data.results || response.data
    
    // Compter les entreprises par statut
    const active = companies.value.filter(c => c.is_active && !c.is_suspended).length
    const suspended = companies.value.filter(c => c.is_suspended).length
    const inactive = companies.value.filter(c => !c.is_active && !c.is_suspended).length
    
    toast.success(
      'Données chargées',
      `${companies.value.length} entreprise(s) trouvée(s) (${active} actives, ${suspended} suspendues)`
    )
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erreur lors du chargement des entreprises'
    
    toast.error(
      'Erreur de chargement',
      'Impossible de charger les entreprises. Vérifiez votre connexion au backend.'
    )
    
    // Garder un tableau vide en cas d'erreur
    companies.value = []
  } finally {
    loading.value = false
  }
}

// Charger les métriques du dashboard
const loadDashboardMetrics = async () => {
  try {
    const response = await superAdminApi.dashboard.overview()
    const data = response.data
    
    // Mise à jour des métriques
    dashboardMetrics.value = {
      monthly_revenue: data.revenue?.monthly_revenue || 0,
      total_revenue: data.revenue?.total_revenue || 0,
      active_companies: data.companies?.active || 0,
      total_companies: data.companies?.total || 0
    }
    
    } catch (err) {
    // Continuer sans bloquer l'interface
  }
}

// Actions avec connexion au backend
const viewCompany = (company) => {
  selectedCompany.value = company
  showDetailsModal.value = true
}

const editCompany = (company) => {
  selectedCompany.value = company
  
  // Pré-remplir le formulaire avec les données de l'entreprise
  formData.value = {
    name: company.name,
    subdomain: company.schema_name,
    email: company.email || '',
    phone: company.phone || '',
    address: company.address || '',
    plan: company.plan || 'starter',
    admin_username: '',
    admin_email: '',
    admin_password: '',
    admin_first_name: '',
    admin_last_name: '',
    feature_services: company.feature_services || false,
    feature_multi_store: company.feature_multi_store || false,
    feature_loans: company.feature_loans || false,
    feature_advanced_analytics: company.feature_advanced_analytics || false,
    feature_api_access: company.feature_api_access || false
  }
  
  showEditModal.value = true
}

const toggleCompanyStatus = async (company) => {
  try {
    const action = company.is_suspended ? 'activer' : 'désactiver'
    const confirmed = await dialog.show({
      type: company.is_suspended ? 'info' : 'warning',
      title: company.is_suspended ? '✅ Activer l\'entreprise' : '⚠️ Désactiver l\'entreprise',
      message: `Voulez-vous ${action} l'entreprise "${company.name}" ?`,
      details: company.is_suspended 
        ? 'L\'entreprise pourra à nouveau accéder à l\'application.'
        : 'L\'entreprise ne pourra plus accéder à l\'application tant qu\'elle est désactivée.',
      showCancel: true,
      confirmText: company.is_suspended ? 'Activer' : 'Désactiver',
      cancelText: 'Annuler'
    })
    
    if (!confirmed) return

    loading.value = true
    
    // Appel API backend
    if (company.is_suspended) {
      await superAdminApi.companies.activate(company.id)
      toast.success('Entreprise activée', `"${company.name}" a été activée avec succès`)
    } else {
      await superAdminApi.companies.suspend(company.id, {
        reason: 'Désactivation manuelle par l\'administrateur'
      })
      toast.warning('Entreprise désactivée', `"${company.name}" a été désactivée`)
    }
    
    // Recharger la liste
    await loadCompanies()
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du changement de statut'
    
    toast.error(
      'Erreur',
      errorMessage
    )
  } finally {
    loading.value = false
  }
}

const deleteCompany = async (company) => {
  try {
    const confirmed = await dialog.show({
      type: 'error',
      title: '⚠️ SUPPRESSION DÉFINITIVE',
      message: `Voulez-vous vraiment supprimer l'entreprise "${company.name}" ?`,
      details: 'Cette action est IRRÉVERSIBLE et supprimera toutes les données, utilisateurs et configurations.',
      showCancel: true,
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler'
    })
    if (!confirmed) return

    // Demande de confirmation du nom via un second dialogue
    const secondConfirm = await dialog.show({
      type: 'warning',
      title: 'Confirmation finale',
      message: `Pour confirmer, veuillez vérifier le nom de l'entreprise`,
      details: `Nom de l'entreprise: "${company.name}"`,
      showCancel: true,
      confirmText: 'Je confirme la suppression',
      cancelText: 'Annuler'
    })
    if (!secondConfirm) {
      toast.warning('Suppression annulée', 'L\'opération a été annulée par sécurité')
      return
    }

    loading.value = true
    
    // Appel API backend
    await superAdminApi.companies.delete(company.id)
    toast.success(
      'Entreprise supprimée',
      `"${company.name}" a été supprimée définitivement`
    )
    
    // Recharger la liste
    await loadCompanies()
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression'
    
    toast.error(
      'Erreur de suppression',
      errorMessage
    )
    
    error.value = errorMessage
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    loading.value = false
  }
}

// Gérer le changement de plan
const onPlanChange = () => {
  // Réinitialiser le prix si on change vers un plan non-custom
  if (formData.value.plan !== 'custom') {
    formData.value.monthly_price = null
  }
}

// Création d'entreprise
const createCompany = async () => {
  try {
    creating.value = true
    createError.value = null
    
    // Validation du sous-domaine
    const subdomain = formData.value.subdomain.toLowerCase().trim()
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      createError.value = 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets'
      return
    }
    
    // Validation du prix personnalisé
    if (formData.value.plan === 'custom' && (!formData.value.monthly_price || formData.value.monthly_price <= 0)) {
      createError.value = 'Le prix mensuel personnalisé est obligatoire pour le plan Custom'
      return
    }
    
    // Préparer les données
    const payload = {
      name: formData.value.name.trim(),
      subdomain: subdomain,
      email: formData.value.email.trim(),
      phone: formData.value.phone.trim(),
      address: formData.value.address.trim(),
      plan: formData.value.plan,
      admin_username: formData.value.admin_username.trim(),
      admin_email: formData.value.admin_email.trim(),
      admin_password: formData.value.admin_password,
      admin_first_name: formData.value.admin_first_name.trim(),
      admin_last_name: formData.value.admin_last_name.trim(),
      feature_services: formData.value.feature_services,
      feature_multi_store: formData.value.feature_multi_store,
      feature_loans: formData.value.feature_loans,
      feature_advanced_analytics: formData.value.feature_advanced_analytics,
      feature_api_access: formData.value.feature_api_access
    }

    // Ajouter le prix personnalisé uniquement si plan custom
    if (formData.value.plan === 'custom') {
      payload.monthly_price = formData.value.monthly_price
    }
    
    // Appel API backend (retourne rapidement maintenant)
    const response = await superAdminApi.companies.create(payload)
    const newCompany = response.data
    const provisioningStatus = newCompany.provisioning_status || 'pending'
    
    // Afficher un message selon le statut
    if (provisioningStatus === 'pending' || provisioningStatus === 'in_progress') {
      toast.loading(
        '🚀 Entreprise en cours de création',
        `L'entreprise "${formData.value.name}" est en cours de provisioning`
      )
      
      // Après 2 secondes, afficher un toast de succès
      setTimeout(() => {
        toast.success(
          'Entreprise enregistrée !',
          `"${formData.value.name}" sera opérationnelle dans quelques instants`,
          `Sous-domaine: ${subdomain}.sgstocks.com\nVous pouvez continuer à naviguer.`
        )
      }, 2000)
    } else {
      toast.success(
        'Entreprise créée avec succès !',
        `L'entreprise "${formData.value.name}" est opérationnelle`,
        `Sous-domaine: ${subdomain}.sgstocks.com\nAdmin: ${formData.value.admin_username}`
      )
    }
    
    // Fermer le modal et réinitialiser
    showCreateModal.value = false
    resetForm()
    
    // Recharger la liste
    await loadCompanies()
    
  } catch (err) {
    // Gérer les erreurs spécifiques
    if (err.response?.data) {
      const errors = err.response.data
      if (typeof errors === 'object') {
        // Formater les erreurs de validation
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        createError.value = errorMessages
      } else {
        createError.value = errors.message || errors
      }
    } else {
      createError.value = err.message || 'Erreur lors de la création de l\'entreprise'
    }
  } finally {
    creating.value = false
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: '',
    plan: 'starter',
    monthly_price: null,
    admin_username: '',
    admin_email: '',
    admin_password: '',
    admin_first_name: '',
    admin_last_name: '',
    feature_services: false,
    feature_multi_store: false,
    feature_loans: false,
    feature_advanced_analytics: false,
    feature_api_access: false
  }
  createError.value = null
}

// Sauvegarder les modifications
const saveCompanyChanges = async () => {
  try {
    editing.value = true
    editError.value = null
    
    // Préparer les données (sans les champs admin)
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,
      plan: formData.value.plan,
      feature_services: formData.value.feature_services,
      feature_multi_store: formData.value.feature_multi_store,
      feature_loans: formData.value.feature_loans,
      feature_advanced_analytics: formData.value.feature_advanced_analytics,
      feature_api_access: formData.value.feature_api_access
    }
    
    // Appel API backend
    await superAdminApi.companies.update(selectedCompany.value.id, payload)
    toast.success(
      'Modifications enregistrées',
      `Les informations de "${formData.value.name}" ont été mises à jour`
    )
    
    // Fermer le modal et recharger
    showEditModal.value = false
    resetForm()
    await loadCompanies()
    
  } catch (err) {
    if (err.response?.data) {
      const errors = err.response.data
      if (typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        editError.value = errorMessages
      } else {
        editError.value = errors.message || errors
      }
    } else {
      editError.value = err.message || 'Erreur lors de la modification'
    }
    
    toast.error(
      'Erreur de modification',
      editError.value
    )
  } finally {
    editing.value = false
  }
}

// Utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Charger les entreprises et les métriques en parallèle
  loadCompanies()
  loadDashboardMetrics()
})
</script>