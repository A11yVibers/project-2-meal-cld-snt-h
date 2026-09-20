import React, { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ title, onClose, children, labelledBy }) {
  const dialogRef = useRef(null)
  const titleId = labelledBy || 'modal-title'
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    // Remember what had focus before the modal opened so it can be restored on close.
    previouslyFocusedRef.current = document.activeElement
    dialogRef.current?.focus()

    return () => {
      const toRestore = previouslyFocusedRef.current
      if (toRestore && typeof toRestore.focus === 'function' && document.contains(toRestore)) {
        toRestore.focus()
      }
    }
  }, [])

  useEffect(() => {
    function getFocusable() {
      if (!dialogRef.current) return []
      return Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === dialogRef.current
      )
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last || !dialogRef.current.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
