import React from 'react'
import { APPROVED_IMAGES } from '../../approved-images.js'
import { seedCoverImageUrls } from '../../data/seedRecipes.js'
import { ACCENT_COLORS } from '../../data/recipeModel.js'

// Cover images are chosen from the approved remote image gallery (the seed
// recipes' cover photos, plus the shared placeholder) rather than uploaded
// from disk, so every image in the app stays a vetted remote URL.
const GALLERY = [APPROVED_IMAGES.placeholder, ...seedCoverImageUrls]

export default function ImageSection({ draft, update }) {
  const selected = draft.coverImageUrl || APPROVED_IMAGES.placeholder

  return (
    <fieldset className="form-section">
      <legend>Image and appearance</legend>

      <div className="field">
        <span>Cover image</span>
        <p className="muted small">Choose a cover photo for this recipe.</p>
        <div className="image-gallery">
          {GALLERY.map((url) => (
            <button
              key={url}
              type="button"
              className={`image-swatch ${selected === url ? 'selected' : ''}`}
              onClick={() => update({ coverImageUrl: url })}
              aria-label="Select this cover image"
              aria-pressed={selected === url}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Recipe card accent color</span>
        <div className="color-swatches">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${draft.accentColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => update({ accentColor: color })}
              aria-label={`Select accent color ${color}`}
              aria-pressed={draft.accentColor === color}
            />
          ))}
        </div>
      </div>
    </fieldset>
  )
}
