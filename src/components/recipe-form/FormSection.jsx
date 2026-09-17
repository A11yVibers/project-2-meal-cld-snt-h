export default function FormSection({ title, description, children, trailing }) {
  return (
    <section className="form-section">
      <div className="form-section__header">
        <div>
          <h2>{title}</h2>
          {description && <p className="muted">{description}</p>}
        </div>
        {trailing}
      </div>
      <div className="form-section__body">{children}</div>
    </section>
  )
}
