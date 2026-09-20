import React, { useRef } from 'react'
import { ACCENT_PALETTE } from '../../data/recipeDraft.js'
import { APPROVED_IMAGES } from '../../approved-images.js'

export default function ImageSection({ draft, updateDraft }) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateDraft({ coverImage: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <fieldset className="form-section">
      <legend>Image and appearance</legend>

      <div className="image-upload-row">
        <img
          src={draft.coverImage || APPROVED_IMAGES.placeholder}
          alt=""
          className="image-upload-preview"
        />
        <div>
          <label className="field-label" htmlFor="rf-cover-image">
            Cover image upload
            <input
              id="rf-cover-image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
          {draft.coverImage && (
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                updateDraft({ coverImage: '' })
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              Remove image
            </button>
          )}
          <p className="field-hint">If no image is uploaded, a placeholder image is used in the catalog.</p>
        </div>
      </div>

      <div className="field-label">
        <span id="rf-accent-label">Recipe card accent color</span>
        <div className="color-swatch-row" role="radiogroup" aria-labelledby="rf-accent-label">
          {ACCENT_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={draft.accentColor === color}
              aria-label={`Accent color ${color}`}
              className={`color-swatch ${draft.accentColor === color ? 'is-selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => updateDraft({ accentColor: color })}
            />
          ))}
        </div>
      </div>
    </fieldset>
  )
}
