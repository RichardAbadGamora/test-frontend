import { useToast as useVueToast } from 'vue-toastification'

export default function useToast() {
  const toast = useVueToast()

  const showToast = (message: string, options: any = {}) => {
    toast(message, {
      ...options,
      position: options.position || 'top-right',
      timeout: options.timeout || 3000,
      type: options.type || 'success'
    })
  }

  const errorToast = (message: string, options: any = {}) => {
    options.type = 'error'
    showToast(message, options)
  }

  const infoToast = (message: string, options: any = {}) => {
    options.type = 'info'
    showToast(message, options)
  }

  const successToast = (message: string, options: any = {}) => {
    options.type = 'success'
    showToast(message, options)
  }

  const warningToast = (message: string, options: any = {}) => {
    options.type = 'warning'
    showToast(message, options)
  }

  return {
    errorToast,
    infoToast,
    showToast,
    successToast,
    warningToast
  }
}
