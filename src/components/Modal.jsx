export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-panel ${wide ? 'modal-panel--wide' : ''}`}>
        <div className="modal-panel__header">
          <h2>{title}</h2>
          <button className="modal-panel__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-panel__body">{children}</div>
      </div>
    </div>
  )
}
