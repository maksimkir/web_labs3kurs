import { useToast } from 'primevue/usetoast'

/** Сповіщення про результат операцій (створено, оновлено, видалено, помилка). */
export function useAppToast() {
  const toast = useToast()

  return {
    success(summary: string, detail?: string): void {
      toast.add({ severity: 'success', summary, detail, life: 3000 })
    },
    error(summary: string, detail?: string): void {
      toast.add({ severity: 'error', summary, detail, life: 5000 })
    },
  }
}
