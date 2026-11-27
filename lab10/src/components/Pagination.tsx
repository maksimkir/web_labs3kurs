import './Pagination.scss'

interface PaginationProps {
  page: number
  totalPages: number
  disabled?: boolean
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, disabled = false, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Сторінки завдань">
      <button
        type="button"
        className="button button--small"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        ← Попередня
      </button>
      <span className="pagination__info" aria-live="polite">
        Сторінка <strong>{page}</strong> з {Math.max(totalPages, 1)}
      </span>
      <button
        type="button"
        className="button button--small"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Наступна →
      </button>
    </nav>
  )
}

export default Pagination
