import { useTaskContext } from '../hooks/useTaskContext'
import Toast from './Toast'
import './ToastContainer.scss'

function ToastContainer() {
  const { toasts, dismissToast } = useTaskContext()

  return (
    // область фіксована в куті екрана й не перекриває решту інтерфейсу
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

export default ToastContainer
