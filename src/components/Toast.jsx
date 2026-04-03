import useStore from '../store/useStore'
import styles from './Toast.module.css'

export default function Toast() {
  const { toast } = useStore()

  return (
    <div className={`${styles.toast} ${toast.visible ? styles.show : ''}`} role="status" aria-live="polite">
      {toast.message}
    </div>
  )
}
