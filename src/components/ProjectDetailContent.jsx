import { asset } from '../lib/asset.js'

// The body of a project case study. Shared by the in-page modal and the
// deep-link /projects/:slug page so they never drift apart.
export default function ProjectDetailContent({ p }) {
  return (
    <>
      <h1 className="detail-title gradient-text">{p.name}</h1>
      <p className="detail-subtitle">{p.subtitle}</p>

      <div className="detail-meta">
        {p.meta.map((m) => <span key={m} className="detail-tag">{m}</span>)}
      </div>

      <div className="detail-gallery">
        {p.images.map((img) => (
          <img key={img} src={asset(img)} alt={`${p.name} screenshot`} loading="lazy" />
        ))}
      </div>

      {p.lead && <p className="detail-lead">{p.lead}</p>}

      {p.sections.map((s) => (
        <div className="detail-block" key={s.heading}>
          <h2 className="detail-heading">{s.heading}</h2>
          <p className="detail-body">{s.body}</p>
        </div>
      ))}

      {p.features.length > 0 && (
        <div className="detail-features">
          {p.features.map((f) => (
            <div className="feature" key={f.title}>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="detail-links">
        {p.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="detail-btn">
            {l.label} ↗
          </a>
        ))}
      </div>
    </>
  )
}
