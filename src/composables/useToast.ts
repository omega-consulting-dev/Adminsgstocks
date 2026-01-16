import { ref } from 'vue'
import type { Component } from 'vue'

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  message: string
  details?: string
  autoClose?: boolean
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
}

const toasts = ref<Toast[]>([])
let nextId = 1

export function useToast() {
  const show = (options: ToastOptions) => {
    const id = nextId++
    const toast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      details: options.details,
      autoClose: options.autoClose ?? true,
      duration: options.duration ?? 5000
    }
    
    toasts.value.push(toast)
    return id
  }

  const success = (title: string, message: string, details?: string) => {
    return show({ type: 'success', title, message, details })
  }

  const error = (title: string, message: string, details?: string) => {
    return show({ type: 'error', title, message, details, duration: 7000 })
  }

  const warning = (title: string, message: string, details?: string) => {
    return show({ type: 'warning', title, message, details, duration: 6000 })
  }

  const info = (title: string, message: string, details?: string) => {
    return show({ type: 'info', title, message, details })
  }

  const loading = (title: string, message: string) => {
    return show({ type: 'loading', title, message, autoClose: false })
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    loading,
    remove,
    clear
  }
}
