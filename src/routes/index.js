import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './../View/Dashboard.vue'
import Clients from './../View/Client.vue'
import Users from './../View/Users.vue'
import Packs from './../View/Packs.vue'
import Paiement from './../View/Paiement.vue'
import Notifications from './../View/notification.vue'
import Connexion from './../View/Connexion.vue'
import Monitoring from './../View/Monitoring.vue'
import Billing from './../View/Billing.vue'
import Support from './../View/Support.vue'
import Settings from './../View/Settings.vue'
import ContactMessages from './../View/ContactMessages.vue'

const routes = [
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/clients', name: 'Clients', component: Clients },
    { path: '/users', name: 'Users', component: Users },
    { path: '/monitoring', name: 'Monitoring', component: Monitoring },
    { path: '/billing', name: 'Billing', component: Billing },
    { path: '/support', name: 'Support', component: Support },
    { path: '/settings', name: 'Settings', component: Settings },
    { path: '/packs', name: 'Packs', component: Packs },
    { path: '/paiement', name: 'Paiement', component: Paiement },
    { path: '/notifications', name: 'Notifications', component: Notifications},
    { path: '/contact-messages', name: 'ContactMessages', component: ContactMessages },
    { path: '/', name: 'Connexion', component: Connexion }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Fonction pour vérifier si le token JWT est expiré
function isTokenExpired(token) {
    if (!token) return true
    
    try {
        // Décoder le payload du JWT (sans vérifier la signature)
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp
        
        if (!exp) return true
        
        // Vérifier si le token expire dans moins de 5 minutes
        const expirationTime = exp * 1000 // Convertir en millisecondes
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        
        return expirationTime < (now + fiveMinutes)
    } catch (e) {
        return true
    }
}

// Guard de navigation pour vérifier l'authentification
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token')
    const publicPages = ['Connexion']
    const authRequired = !publicPages.includes(to.name)
    
    // Vérifier si le token est expiré
    if (token && isTokenExpired(token)) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        
        if (authRequired) {
            return next({ name: 'Connexion' })
        }
    }
    
    // Rediriger vers la connexion si authentification requise et pas de token
    if (authRequired && !token) {
        return next({ name: 'Connexion' })
    }
    
    // Rediriger vers Dashboard si déjà connecté et tente d'accéder à la connexion
    if (to.name === 'Connexion' && token && !isTokenExpired(token)) {
        return next({ name: 'Dashboard' })
    }
    
    next()
})

export default router