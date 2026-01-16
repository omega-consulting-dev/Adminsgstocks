<template>
  <teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
      <NotificationToast
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :details="toast.details"
        :auto-close="toast.autoClose"
        :duration="toast.duration"
        @close="remove(toast.id)"
        class="pointer-events-auto"
      />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
import NotificationToast from './NotificationToast.vue'

const { toasts, remove } = useToast()
</script>
