import { UNDO_DELAY_MS } from '../context/TaskContext'
import { useTaskContext } from '../hooks/useTaskContext'
import './UndoToast.scss'

function UndoToast() {
  const { pendingDelete, undoDelete } = useTaskContext()

  if (!pendingDelete) return null

  return (
    <div className="undo-toast" role="status">
      <div className="undo-toast__body">
        <p className="undo-toast__text">Буде видалено: {pendingDelete.label}</p>
        <button type="button" className="button button--small button--primary" onClick={undoDelete}>
          Скасувати
        </button>
      </div>
      {/* key перезапускає CSS-анімацію прогресу для кожного нового видалення */}
      <div
        key={pendingDelete.key}
        className="undo-toast__progress"
        style={{ animationDuration: `${UNDO_DELAY_MS}ms` }}
        aria-hidden="true"
      />
    </div>
  )
}

export default UndoToast
