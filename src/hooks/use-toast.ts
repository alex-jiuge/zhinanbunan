import { useCallback } from "react"
import { useToastContext, type ToastVariant } from "@/components/ui/toast"

export function useToast() {
  const { addToast } = useToastContext()

  const showToast = useCallback(
    (
      title: string,
      options?: {
        description?: string
        variant?: ToastVariant
        duration?: number
      }
    ) => {
      if (!addToast) return
      addToast({
        title,
        description: options?.description,
        variant: options?.variant ?? "default",
        duration: options?.duration,
      })
    },
    [addToast]
  )

  const success = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, variant: "success" })
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, variant: "error", duration: 6000 })
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, variant: "warning", duration: 5000 })
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, variant: "info" })
    },
    [showToast]
  )

  return {
    showToast,
    success,
    error,
    warning,
    info,
  }
}
