import { ACCENT_COLOR_SWATCHES } from '../../data/lookups.js'
import { APPROVED_IMAGES } from '../../approved-images.js'
import FormSection from './FormSection.jsx'

const MAX_DIMENSION = 900

function downscaleImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageAppearanceSection({ form, updateForm }) {
  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await downscaleImage(file)
      updateForm({ coverImageDataUrl: dataUrl })
    } catch (err) {
      console.warn('Could not process uploaded image', err)
    }
  }

  const previewSrc = form.coverImageDataUrl || APPROVED_IMAGES.placeholder

  return (
    <FormSection title="Image and appearance" description="A cover photo and accent color help this recipe stand out in the catalog.">
      <div className="field-row image-appearance">
        <div className="field">
          <span>Cover image</span>
          <img className="image-preview" src={previewSrc} alt="Cover preview" />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.coverImageDataUrl && (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => updateForm({ coverImageDataUrl: '' })}>
              Remove image
            </button>
          )}
          {!form.coverImageDataUrl && <p className="muted small">No image uploaded — the placeholder image will be used.</p>}
        </div>

        <div className="field">
          <span>Recipe card accent color</span>
          <div className="swatch-row">
            {ACCENT_COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch ${form.accentColor === color ? 'is-selected' : ''}`}
                style={{ backgroundColor: color }}
                aria-label={color}
                onClick={() => updateForm({ accentColor: color })}
              />
            ))}
            <input
              type="color"
              className="swatch swatch--custom"
              value={form.accentColor}
              onChange={(e) => updateForm({ accentColor: e.target.value })}
              title="Custom color"
            />
          </div>
        </div>
      </div>
    </FormSection>
  )
}
