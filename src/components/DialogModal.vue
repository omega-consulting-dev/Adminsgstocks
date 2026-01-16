<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        @click.self="onBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          :class="[
            'relative bg-white rounded-2xl shadow-2xl max-w-md w-full',
            'transform transition-all duration-300'
          ]"
        >
          <!-- Header -->
          <div :class="['p-6 border-b', headerBorderClass]">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center', iconBgClass]">
                <component :is="iconComponent" :class="['w-6 h-6', iconColorClass]" />
              </div>
              <h3 :class="['text-xl font-bold flex-1', titleColorClass]">
                {{ title }}
              </h3>
              <button
                v-if="showClose"
                @click="cancel"
                class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <p class="text-gray-700 text-base leading-relaxed">
              {{ message }}
            </p>
            <p v-if="details" class="mt-3 text-sm text-gray-500">
              {{ details }}
            </p>
          </div>

          <!-- Footer -->
          <div class="p-6 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3">
            <button
              v-if="showCancel"
              @click="cancel"
              class="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              :class="[
                'px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-md hover:shadow-lg',
                confirmBtnClass
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info, X, HelpCircle } from 'lucide-vue-next'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm'
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  showClose?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  confirmText: 'OK',
  cancelText: 'Annuler',
  showCancel: false,
  showClose: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(false)

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    confirm: HelpCircle
  }
  return icons[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    confirm: 'bg-blue-500'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => 'text-white')

const titleColorClass = computed(() => {
  const classes = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
    confirm: 'text-blue-900'
  }
  return classes[props.type]
})

const headerBorderClass = computed(() => {
  const classes = {
    success: 'border-green-100',
    error: 'border-red-100',
    warning: 'border-yellow-100',
    info: 'border-blue-100',
    confirm: 'border-blue-100'
  }
  return classes[props.type]
})

const confirmBtnClass = computed(() => {
  const classes = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    confirm: 'bg-blue-600 hover:bg-blue-700'
  }
  return classes[props.type]
})

const confirm = () => {
  visible.value = false
  setTimeout(() => emit('confirm'), 300)
}

const cancel = () => {
  visible.value = false
  setTimeout(() => emit('cancel'), 300)
}

const onBackdropClick = () => {
  if (props.closeOnBackdrop) {
    cancel()
  }
}

onMounted(() => {
  visible.value = true
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>
