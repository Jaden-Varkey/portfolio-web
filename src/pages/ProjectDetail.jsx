import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projectDetails } from '../data/content.js'
import Background from '../components/Background.jsx'
import '../styles/detail.css'

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
  }),
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projectDetails[slug]
  if (!p) return <Navigate to="/" replace />

  return (
    <main className="detail">
      <Background />
      <div className="wrap">
        <Link to="/" className="back link-underline">← Back</Link>

        <motion.h1 className="detail-title gradient-text" variants={fade} initial="hidden" animate="show">
          {p.name}
        </motion.h1>
        <motion.p className="detail-subtitle" variants={fade} custom={1} initial="hidden" animate="show">
          {p.subtitle}
        </motion.p>

        <motion.div className="detail-meta" variants={fade} custom={2} initial="hidden" animate="show">
          {p.meta.map((m) => <span key={m} className="detail-tag">{m}</span>)}
        </motion.div>

        <motion.div className="detail-gallery" variants={fade} custom={3} initial="hidden" animate="show">
          {p.images.map((img) => (
            <img key={img} src={img} alt={`${p.name} screenshot`} loading="lazy" />
          ))}
        </motion.div>

        <p className="detail-lead">{p.lead}</p>

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
      </div>
    </main>
  )
}
