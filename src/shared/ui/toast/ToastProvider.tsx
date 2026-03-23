import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  ToastContext,
  type ToastItem,
  type ToastVariant,
} from './toast-context'
import styles from './Toast.module.css'

const DEFAULT_DURATION_MS = 4000

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = nextId.current++
    setItems((list) => [...list, { id, message, variant }])
    window.setTimeout(() => dismiss(id), DEFAULT_DURATION_MS)
  }, [dismiss])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite" aria-relevant="additions">
        {items.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.variant]}`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
