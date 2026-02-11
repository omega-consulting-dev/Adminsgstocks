<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, User, Lock, AlertCircle } from 'lucide-vue-next'
import { superAdminApi } from '../services/superadmin-api'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    // Réinitialiser l'erreur
    error.value = ''

    // Validation des champs
    if (!email.value || !password.value) {
        error.value = 'Veuillez remplir tous les champs'
        return
    }

    loading.value = true

    try {
        // Utiliser le endpoint auth login
        const response = await fetch(`http://${import.meta.env.VITE_API_BASE_DOMAIN}/api/v1/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw { response: { status: response.status, data } }
        }

        // Vérifier la réponse
        if (data && data.access) {
            // Stocker le token et les données utilisateur
            localStorage.setItem('auth_token', data.access)
            localStorage.setItem('refresh_token', data.refresh)
            localStorage.setItem('user_data', JSON.stringify(data.user))
            
            // Redirection vers le dashboard UNIQUEMENT si succès
            await router.push('/Dashboard')
        } else {
            error.value = 'Réponse invalide du serveur'
            loading.value = false
        }
    } catch (err) {
        // Arrêter le chargement immédiatement
        loading.value = false
        
        // Gestion détaillée des erreurs
        if (err.response) {
            // Erreur avec réponse du serveur
            const status = err.response.status
            const data = err.response.data
            
            if (status === 401) {
                error.value = 'Email ou mot de passe incorrect'
            } else if (status === 400) {
                // Récupérer le message d'erreur du backend
                if (data.login_error) {
                    error.value = data.login_error
                } else if (data.email) {
                    error.value = 'Email invalide'
                } else if (data.password) {
                    error.value = 'Mot de passe invalide'
                } else if (data.non_field_errors) {
                    error.value = data.non_field_errors[0]
                } else {
                    error.value = 'Données de connexion invalides'
                }
            } else if (status === 403) {
                error.value = 'Accès refusé'
            } else if (status === 500) {
                error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
            } else {
                error.value = 'Erreur de connexion. Veuillez réessayer.'
            }
        } else if (err.request) {
            // La requête a été faite mais pas de réponse
            error.value = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
        } else {
            // Erreur lors de la configuration de la requête
            error.value = 'Erreur inattendue. Veuillez réessayer.'
        }
        
        // Ne PAS rediriger en cas d'erreur
        }
}

const handleForgotPassword = () => {
    // TODO: Implémenter la récupération de mot de passe
}

const handleCreateAccount = () => {
    // TODO: Implémenter la création de compte
}

const closeModal = () => {
    // TODO: Implémenter la fermeture si nécessaire
}
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">

        <!-- Modale de connexion -->
        <div class="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-slideUp">

            <!-- Bouton fermer -->
            <button @click="closeModal"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group">
                <X :size="20" class="text-gray-600 group-hover:text-gray-900" />
            </button>

            <!-- Logo -->
            <div class="flex justify-center mb-6">
                <img src="./../assets/images/logo.svg" alt="" class="w-17 h-17  object-contain"/>
           
            </div>


            <!-- Titre -->
            <h1 class="text-center text-xl font-semibold text-gray-900 mb-2">
                Bienvenue sur SG-STOCK
            </h1>
            <p class="text-center text-sm text-gray-600 mb-8">
                Connectez-vous pour accéder à votre espace
            </p>

            <!-- Formulaire -->
            <form @submit.prevent="handleLogin" class="space-y-5">

                <!-- Message d'erreur -->
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle :size="18" class="text-red-600 mt-0.5 flex-shrink-0" />
                    <p class="text-sm text-red-600">{{ error }}</p>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User :size="18" class="text-gray-400" />
                        </div>
                        <input 
                            id="email" 
                            v-model="email" 
                            type="email" 
                            placeholder="exemple@email.com"
                            :disabled="loading"
                            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required 
                        />
                    </div>
                </div>

                <!-- Mot de passe -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock :size="18" class="text-gray-400" />
                        </div>
                        <input 
                            id="password" 
                            v-model="password" 
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                            :disabled="loading"
                            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required 
                        />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Bouton de connexion -->
                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
                </button>

                <!-- Mot de passe oublié -->
                <div class="text-center">
                    <button type="button" @click="handleForgotPassword"
                        class="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                        Mot de passe oublié ?
                    </button>
                </div>

            </form>

            <!-- Séparateur -->
            <div class="my-6 border-t border-gray-200"></div>

            <!-- Créer un compte -->
            <div class="text-center">
                <p class="text-sm text-gray-600 mb-2">
                @Copright sg-stock -2025
                </p>
            </div>

        </div>

    </div>
</template>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slideUp {
    animation: slideUp 0.4s ease-out;
}
</style>