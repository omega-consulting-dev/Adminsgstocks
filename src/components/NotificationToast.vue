<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="[
        'fixed top-6 right-6 z-50 max-w-md w-full shadow-2xl rounded-xl overflow-hidden',
        'transform transition-all duration-300 ease-out',
        backgroundClass
      ]"
    >
      <div class="p-6 flex items-start gap-4">
        <!-- Icon -->
        <div :class="['w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', iconBgClass]">
          <component :is="iconComponent" :class="['w-6 h-6', iconColorClass]" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 :class="['text-lg font-bold mb-1', titleColorClass]">
            {{ title }}
          </h3>
          <p :class="['text-sm', messageColorClass]">
            {{ message }}
          </p>
          <div v-if="details" :class="['mt-2 text-xs', detailsColorClass]">
            {{ details }}
          </div>
        </div>

        <!-- Close button -->
        <button
          @click="close"
          :class="['flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors', closeBtnClass]"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Progress bar -->
      <div v-if="autoClose" class="h-1 bg-black/10">
        <div
          :class="['h-full transition-all duration-100 linear', progressBarClass]"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info, X, Loader } from 'lucide-vue-next'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  message: string
  details?: string
  autoClose?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  autoClose: true,
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
const progress = ref(100)
let timer: ReturnType<typeof setInterval> | null = null
let closeTimeout: ReturnType<typeof setTimeout> | null = null

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Loader
  }
  return icons[props.type]
})

const backgroundClass = computed(() => {
  const classes = {
    success: 'bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500',
    error: 'bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500',
    warning: 'bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500',
    info: 'bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500',
    loading: 'bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500'
  }
  return classes[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    loading: 'bg-purple-500'
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
    loading: 'text-purple-900'
  }
  return classes[props.type]
})

const messageColorClass = computed(() => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
    loading: 'text-purple-700'
  }
  return classes[props.type]
})

const detailsColorClass = computed(() => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    loading: 'text-purple-600'
  }
  return classes[props.type]
})

const closeBtnClass = computed(() => {
  const classes = {
    success: 'hover:bg-green-100 text-green-700',
    error: 'hover:bg-red-100 text-red-700',
    warning: 'hover:bg-yellow-100 text-yellow-700',
    info: 'hover:bg-blue-100 text-blue-700',
    loading: 'hover:bg-purple-100 text-purple-700'
  }
  return classes[props.type]
})

const progressBarClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    loading: 'bg-purple-500'
  }
  return classes[props.type]
})

const close = () => {
  visible.value = false
  if (timer) clearInterval(timer)
  if (closeTimeout) clearTimeout(closeTimeout)
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  visible.value = true

  if (props.autoClose && props.type !== 'loading') {
    const step = 100 / (props.duration / 100)
    timer = setInterval(() => {
      progress.value -= step
      if (progress.value <= 0) {
        close()
      }
    }, 100)

    closeTimeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

watch(() => props.type, (newType) => {
  // Si le type change de loading à autre chose, démarrer l'auto-close
  if (newType !== 'loading' && props.autoClose) {
    const step = 100 / (props.duration / 100)
    timer = setInterval(() => {
      progress.value -= step
      if (progress.value <= 0) {
        close()
      }
    }, 100)

    closeTimeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}
</style>
