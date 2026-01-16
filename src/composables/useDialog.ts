import { ref, h, render, type Component } from 'vue'
import DialogModal from '../components/DialogModal.vue'

export interface DialogOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm'
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  showClose?: boolean
}

export function useDialog() {
  const show = (options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const onConfirm = () => {
        cleanup()
        resolve(true)
      }

      const onCancel = () => {
        cleanup()
        resolve(false)
      }

      const cleanup = () => {
        setTimeout(() => {
          render(null, container)
          document.body.removeChild(container)
        }, 300)
      }

      const vnode = h(DialogModal, {
        ...options,
        onConfirm,
        onCancel
      })

      render(vnode, container)
    })
  }

  const alert = (title: string, message: string, details?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    return show({
      type,
      title,
      message,
      details,
      showCancel: false,
      confirmText: 'OK'
    })
  }

  const success = (title: string, message: string, details?: string) => {
    return alert(title, message, details, 'success')
  }

  const error = (title: string, message: string, details?: string) => {
    return alert(title, message, details, 'error')
  }

  const warning = (title: string, message: string, details?: string) => {
    return alert(title, message, details, 'warning')
  }

  const info = (title: string, message: string, details?: string) => {
    return alert(title, message, details, 'info')
  }

  const confirm = (title: string, message: string, details?: string) => {
    return show({
      type: 'confirm',
      title,
      message,
      details,
      showCancel: true,
      confirmText: 'Confirmer',
      cancelText: 'Annuler'
    })
  }

  return {
    show,
    alert,
    success,
    error,
    warning,
    info,
    confirm
  }
}
