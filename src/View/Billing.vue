<template>
  <Layout 
    titre="Facturation & Paiements"
    description="Gestion des factures et revenus"
  >
    <div class="p-6 space-y-6">

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <RefreshCw class="w-12 h-12 animate-spin text-blue-600" />
          <span class="text-xl font-medium text-gray-700">Chargement des factures...</span>
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
            <button @click="refreshInvoices" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
              <RefreshCw class="w-4 h-4 inline mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <template v-else>

      <!-- Actions rapides -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Actions Rapides</h2>
        </div>
        
        <div class="flex gap-3">
          <button @click="generateInvoices" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FileText class="w-4 h-4" />
            Générer factures mensuelles
          </button>
        </div>
      </section>

      <!-- Liste des factures -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Dernières Factures</h2>
          
          <div class="flex gap-2">
            <select v-model="statusFilter" class="px-3 py-2 border rounded-lg">
              <option value="">Tous statuts</option>
              <option value="paid">Payées</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
            </select>
            
            <button @click="refreshInvoices" class="p-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-3 text-left text-sm font-medium text-gray-500">FACTURE</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">ENTREPRISE</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">PLAN</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">MONTANT</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">DATE</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">STATUT</th>
                <th class="p-3 text-left text-sm font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
                <td class="p-3">
                  <div>
                    <p class="font-medium text-gray-900">#{{ invoice.invoice_number }}</p>
                    <p class="text-xs text-gray-500">Période: {{ formatPeriod(invoice.invoice_date) }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <div>
                    <p class="font-medium">{{ invoice.company_name || 'N/A' }}</p>
                    <p class="text-sm text-gray-500">{{ invoice.company || '' }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Abonnement
                  </span>
                </td>
                <td class="p-3">
                  <p class="font-medium">{{ formatCurrency(invoice.total_amount || 0) }}</p>
                  <p class="text-xs text-gray-500">TTC</p>
                </td>
                <td class="p-3">
                  <div>
                    <p class="text-sm">{{ formatDate(invoice.invoice_date) }}</p>
                    <p class="text-xs text-gray-500">
                      Échéance: {{ formatDate(invoice.due_date) }}
                    </p>
                  </div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(invoice.status)">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex gap-1">
                    <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                            @click="markAsPaid(invoice)"
                            title="Marquer comme payée"
                            class="p-1.5 text-green-600 hover:bg-green-50 rounded transition">
                      <CreditCard class="w-4 h-4" />
                    </button>
                    <button @click="viewInvoice(invoice.id)"
                            class="p-1 hover:bg-gray-100 rounded">
                      <Eye class="w-4 h-4 text-gray-500" />
                    </button>
                    <button @click="downloadInvoice(invoice.id)"
                            class="p-1 hover:bg-gray-100 rounded">
                      <Download class="w-4 h-4 text-gray-500" />
                    </button>
                    <button v-if="invoice.status === 'pending'" 
                            @click="sendReminder(invoice.id)"
                            class="p-1 hover:bg-gray-100 rounded">
                      <Mail class="w-4 h-4 text-orange-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredInvoices.length === 0" class="text-center py-8 text-gray-500">
          Aucune facture trouvée
        </div>
      </section>

      </template>

    </div>

    <!-- Modal Détails Facture -->
    <teleport to="body">
      <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Détails de la facture</h2>
                <p class="text-blue-100 mt-1">{{ selectedInvoice?.invoice_number }}</p>
              </div>
              <button @click="showDetailsModal = false" class="p-2 hover:bg-white/10 rounded-lg transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="selectedInvoice" class="p-6 space-y-6">
            <!-- Statut -->
            <div class="flex items-center justify-between pb-4 border-b">
              <div>
                <p class="text-sm text-gray-500">Statut</p>
                <span class="px-3 py-1 text-sm rounded-full inline-block mt-1" :class="getStatusClass(selectedInvoice.status)">
                  {{ getStatusLabel(selectedInvoice.status) }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Montant Total</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(selectedInvoice.total_amount || 0) }}</p>
              </div>
            </div>

            <!-- Informations entreprise -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-3">Informations Client</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Entreprise</p>
                  <p class="font-medium">{{ selectedInvoice.company_name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">ID Client</p>
                  <p class="font-medium">#{{ selectedInvoice.company }}</p>
                </div>
              </div>
            </div>

            <!-- Détails facture -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">Détails de Facturation</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Numéro de facture</span>
                  <span class="font-medium">{{ selectedInvoice.invoice_number }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date d'émission</span>
                  <span class="font-medium">{{ formatDate(selectedInvoice.invoice_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date d'échéance</span>
                  <span class="font-medium">{{ formatDate(selectedInvoice.due_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Période</span>
                  <span class="font-medium">{{ formatPeriod(selectedInvoice.invoice_date) }}</span>
                </div>
              </div>
            </div>

            <!-- Montants -->
            <div class="border-t pt-4">
              <h3 class="font-semibold text-gray-900 mb-3">Détails Montants</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Montant HT</span>
                  <span class="font-medium">{{ formatCurrency(selectedInvoice.amount || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">TVA</span>
                  <span class="font-medium">{{ formatCurrency(selectedInvoice.tax_amount || 0) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total TTC</span>
                  <span>{{ formatCurrency(selectedInvoice.total_amount || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Informations paiement -->
            <div v-if="selectedInvoice.status === 'paid'" class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 class="font-semibold text-green-900 mb-3">Informations de Paiement</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-green-700">Date de paiement</span>
                  <span class="font-medium text-green-900">{{ formatDate(selectedInvoice.payment_date) }}</span>
                </div>
                <div v-if="selectedInvoice.payment_method" class="flex justify-between">
                  <span class="text-green-700">Méthode</span>
                  <span class="font-medium text-green-900">{{ selectedInvoice.payment_method }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t">
              <button @click="downloadInvoice(selectedInvoice)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Download class="w-4 h-4" />
                Télécharger PDF
              </button>
              <button v-if="selectedInvoice.status === 'pending'"
                      @click="markAsPaidFromModal(selectedInvoice)"
                      class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <CreditCard class="w-4 h-4" />
                Marquer comme payée
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Layout from './../components/Layout.vue'
import {
  DollarSign, Clock, AlertTriangle, CreditCard, FileText,
  Download, RefreshCw, Eye, Mail
} from 'lucide-vue-next'
import { superAdminApi } from '../services/superadmin-api'
import { useToast } from '../composables/useToast'
import { jsPDF } from 'jspdf'

const toast = useToast()

// État réactif
const loading = ref(true)
const error = ref(null)
const statusFilter = ref('')
const showDetailsModal = ref(false)
const selectedInvoice = ref(null)

// Données depuis le backend
const invoices = ref([])

// Computed pour filtrer les factures
const filteredInvoices = computed(() => {
  if (!statusFilter.value) return invoices.value
  return invoices.value.filter(invoice => invoice.status === statusFilter.value)
})

// Méthodes API
const loadInvoices = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await superAdminApi.billing.list()
    invoices.value = response.data.results || response.data
    console.log('✅ Factures chargées:', invoices.value.length, 'facture(s)')
    
    toast.success(
      'Factures chargées',
      `${invoices.value.length} facture(s) trouvée(s)`
    )
  } catch (err) {
    console.error('❌ Erreur chargement factures:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur lors du chargement des factures'
    
    toast.error(
      'Erreur de chargement',
      'Impossible de charger les factures. Vérifiez votre connexion au backend.'
    )
    
    invoices.value = []
  } finally {
    loading.value = false
  }
}

// Méthodes utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const formatPeriod = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  
  return `${month} ${year}`
}

const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    paid: 'Payée',
    pending: 'En attente',
    overdue: 'En retard'
  }
  return labels[status] || status
}

// Actions
const generateInvoices = async () => {
  try {
    toast.info('Génération en cours', 'Création des factures mensuelles...')
    console.log('Generating monthly invoices...')
    
    const response = await superAdminApi.billing.generateMonthly()
    const data = response.data
    
    const messages = []
    if (data.created > 0) messages.push(`${data.created} créée(s)`)
    if (data.updated > 0) messages.push(`${data.updated} mise(s) à jour`)
    if (data.skipped > 0) messages.push(`${data.skipped} déjà existante(s)`)
    
    toast.success(
      'Factures générées', 
      messages.join(', ')
    )
    
    await loadInvoices()
  } catch (err) {
    console.error('❌ Erreur génération factures:', err)
    toast.error('Erreur', err.response?.data?.message || 'Impossible de générer les factures')
  }
}



const refreshInvoices = async () => {
  toast.info('Actualisation', 'Rechargement des factures...')
  await loadInvoices()
}

const viewInvoice = (id) => {
  console.log('Viewing invoice:', id)
  const invoice = invoices.value.find(inv => inv.id === id)
  
  if (invoice) {
    selectedInvoice.value = invoice
    showDetailsModal.value = true
  } else {
    toast.error('Erreur', 'Facture introuvable')
  }
}

const downloadInvoice = async (invoice) => {
  try {
    const invoiceData = invoice.id ? invoice : invoices.value.find(inv => inv.id === invoice)
    
    if (!invoiceData) {
      toast.error('Erreur', 'Facture introuvable')
      return
    }

    toast.info('Téléchargement', `Génération du PDF de ${invoiceData.invoice_number}...`)
    
    // Fonction pour formater les montants pour le PDF (sans caractères spéciaux)
    const formatAmount = (amount) => {
      const number = Math.round(parseFloat(amount || 0))
      // Formater avec des espaces normaux (pas d'espaces insécables)
      const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return formatted + ' FCFA'
    }
    
    const formatDateSimple = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    // Créer un nouveau document PDF
    const doc = new jsPDF()
    
    // Configuration de la page
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    
    // ============ EN-TÊTE SIMPLE ============
    // Logo/Titre
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(41, 98, 255) // Bleu doux
    doc.text('SG STOCKS', margin, 25)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('Systeme de Gestion de Stock', margin, 32)
    
    // Ligne de séparation douce
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.line(margin, 38, pageWidth - margin, 38)
    
    // ============ NUMÉRO FACTURE ============
    let yPos = 55
    
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('FACTURE', margin, yPos)
    
    doc.setFontSize(16)
    doc.setTextColor(41, 98, 255)
    doc.text(invoiceData.invoice_number, pageWidth - margin, yPos, { align: 'right' })
    
    yPos += 15
    
    // Date d'émission
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Date: ' + formatDateSimple(invoiceData.invoice_date), margin, yPos)
    doc.text('Periode: ' + formatPeriod(invoiceData.invoice_date), pageWidth - margin, yPos, { align: 'right' })
    
    yPos += 20
    
    // ============ INFORMATIONS CLIENT ============
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 2, 2, 'F')
    
    yPos += 8
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('CLIENT', margin + 8, yPos)
    
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text('Entreprise: ' + (invoiceData.company_name || 'N/A'), margin + 8, yPos)
    
    yPos += 6
    
    doc.text('ID: #' + invoiceData.company, margin + 8, yPos)
    
    yPos += 20
    
    // ============ TABLEAU DES SERVICES ============
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('DETAILS', margin, yPos)
    
    yPos += 8
    
    // En-tête tableau (fond gris clair)
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F')
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 80)
    doc.text('DESCRIPTION', margin + 3, yPos + 5.5)
    doc.text('MONTANT', pageWidth - margin - 3, yPos + 5.5, { align: 'right' })
    
    yPos += 8
    
    // Ligne service
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text('Abonnement mensuel SG Stocks', margin + 3, yPos + 5)
    doc.text(formatAmount(invoiceData.amount), pageWidth - margin - 3, yPos + 5, { align: 'right' })
    
    yPos += 8
    
    // Ligne TVA
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 6
    
    const taxRate = invoiceData.tax_amount > 0 ? '19.25%' : '0%'
    doc.setTextColor(100, 100, 100)
    doc.text('TVA (' + taxRate + ')', margin + 3, yPos)
    doc.text(formatAmount(invoiceData.tax_amount), pageWidth - margin - 3, yPos, { align: 'right' })
    
    yPos += 10
    
    // Ligne séparation avant total
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.8)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 8
    
    // TOTAL
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(41, 98, 255)
    doc.text('TOTAL', margin + 3, yPos)
    doc.setFontSize(16)
    doc.text(formatAmount(invoiceData.total_amount), pageWidth - margin - 3, yPos, { align: 'right' })
    
    yPos += 15
    
    // ============ STATUT ============
    if (invoiceData.status === 'paid') {
      doc.setFillColor(236, 253, 245)
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, 'F')
      
      yPos += 7
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(5, 150, 105)
      doc.text('PAIEMENT RECU', margin + 8, yPos)
      
      yPos += 6
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Date: ' + formatDateSimple(invoiceData.payment_date), margin + 8, yPos)
      
      if (invoiceData.payment_method) {
        doc.text(' - Methode: ' + invoiceData.payment_method, margin + 60, yPos)
      }
      
      yPos += 15
    } else if (invoiceData.status === 'pending') {
      doc.setFillColor(255, 251, 235)
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 12, 2, 2, 'F')
      
      yPos += 8
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(217, 119, 6)
      doc.text('EN ATTENTE DE PAIEMENT', margin + 8, yPos)
      
      yPos += 15
    } else if (invoiceData.status === 'overdue') {
      doc.setFillColor(254, 242, 242)
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 12, 2, 2, 'F')
      
      yPos += 8
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(220, 38, 38)
      doc.text('PAIEMENT EN RETARD', margin + 8, yPos)
      
      yPos += 15
    }
    
    // ============ NOTES ============
    yPos += 5
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(120, 120, 120)
    doc.text('Paiement par virement bancaire ou mobile money.', margin, yPos)
    yPos += 4
    doc.text('Pour toute question, contactez notre service client.', margin, yPos)
    
    // ============ FOOTER ============
    const footerY = pageHeight - 25
    
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.3)
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text('SG Stocks - Yaounde, Cameroun', pageWidth / 2, footerY, { align: 'center' })
    doc.text('www.sgstocks.com', pageWidth / 2, footerY + 4, { align: 'center' })
    
    doc.setFontSize(7)
    doc.text('Page 1/1', pageWidth - margin, footerY + 4, { align: 'right' })
    
    // Télécharger le PDF
    const fileName = 'Facture_' + invoiceData.invoice_number + '_' + (invoiceData.company_name?.replace(/\s+/g, '_') || 'Client') + '.pdf'
    doc.save(fileName)
    
    toast.success('PDF telecharge', fileName + ' a ete telecharge avec succes')
  } catch (err) {
    console.error('❌ Erreur telechargement:', err)
    toast.error('Erreur', 'Impossible de generer le PDF de la facture')
  }
}

const sendReminder = async (invoiceId) => {
  try {
    const invoice = invoices.value.find(inv => inv.id === invoiceId)
    
    if (!invoice) {
      toast.error('Erreur', 'Facture introuvable')
      return
    }

    toast.info('Envoi en cours', `Envoi de la relance pour ${invoice.company_name}...`)
    console.log('Sending reminder for invoice:', invoice.id)
    
    // Simuler l'envoi d'email (à remplacer par un vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success(
      'Relance envoyée',
      `Email de relance envoyé à l'entreprise ${invoice.company_name}`
    )
    
    console.log('✅ Relance envoyée pour facture:', invoice.invoice_number)
  } catch (err) {
    console.error('❌ Erreur envoi relance:', err)
    toast.error('Erreur', 'Impossible d\'envoyer la relance')
  }
}

const markAsPaid = async (invoice) => {
  try {
    console.log('Marking invoice as paid:', invoice.id)
    
    await superAdminApi.billing.markPaid(invoice.id, {
      payment_method: 'Virement bancaire'
    })
    
    toast.success('Paiement enregistré', `Facture ${invoice.invoice_number} marquée comme payée`)
    await loadInvoices()
  } catch (err) {
    console.error('❌ Erreur mise à jour facture:', err)
    toast.error('Erreur', err.response?.data?.message || 'Impossible de mettre à jour la facture')
  }
}

const markAsPaidFromModal = async (invoice) => {
  await markAsPaid(invoice)
  showDetailsModal.value = false
}

// Lifecycle
onMounted(() => {
  console.log('Billing page loaded')
  loadInvoices()
})
</script>