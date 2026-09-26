import React, { useRef } from 'react'
import { APPROVED_IMAGES } from '../../approved-images.js'
import { ACCENT_COLORS } from '../../lib/constants.js'

export default function ImageSection({ value, onChange }) {
  const fileRef = useRef(null)
  const set = (patch) => onChange({ ...value, ...patch })

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ coverImage: reader.result })
    reader.readAsDataURL(file)
  }

  return (
    <div className="form-section-body">
      <div className="form-row">
        <span className="field-label">Cover image</span>
        <div className="image-upload-row">
          <img className="image-preview" src={value.coverImage || APPROVED_IMAGES.placeholder} alt="Cover preview" />
          <div className="image-upload-controls">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} aria-label="Upload cover image" />
            {value.coverImage && (
              <button type="button" className="btn btn-secondary btn-small" onClick={() => { set({ coverImage: '' }); if (fileRef.current) fileRef.current.value = '' }}>
                Remove photo, use placeholder
              </button>
            )}
            <p className="hint-text">Uploaded photos are stored only in your browser. If you skip this, the placeholder image is used.</p>
          </div>
        </div>
      </div>

      <div className="form-row">
        <span className="field-label">Recipe card accent color</span>
        <div className="color-swatch-row" role="group" aria-label="Accent color">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${value.accentColor === color ? 'is-selected' : ''}`}
              style={{ backgroundColor: color }}
              aria-label={`Accent color ${color}`}
              aria-pressed={value.accentColor === color}
              onClick={() => set({ accentColor: color })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
