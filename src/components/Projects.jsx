import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/content.js'
import { asset } from '../lib/asset.js'
import ProjectModal from './ProjectModal.jsx'

// Bento layout: which cells each card claims, by position in the list. The
// grid packs these densely into a 4-column mosaic (areas sum to a clean fill).
const LAYOUT = ['c2 r2 feature', 'c2', '', '', 'c2', '', '']

export default function Projects() {
  const [active, setActive] = useState(null) // index being hovered
  const [openSlug, setOpenSlug] = useState(null) // project shown in the modal

  return (
    <section className="section proj-section" id="projects">
      <div className="wrap proj-wrap">
        <p className="eyebrow">Projects</p>
        <div className="proj-grid">
          {projects.map((p, i) => {
            const Card = p.slug ? 'button' : 'div'
            const cardProps = p.slug
              ? { type: 'button', onClick: () => setOpenSlug(p.slug) }
              : {}
            return (
              <motion.div
                key={p.name}
                className={`proj-grid-item ${LAYOUT[i] || ''}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <Card className={`proj-card ${p.slug ? 'is-link' : ''}`} {...cardProps}>
                  <div className="proj-head">
                    <h3 className="proj-name gradient-text">{p.name}</h3>
                    {p.slug && <span className="proj-arrow" aria-hidden>↗</span>}
                  </div>
                  <p className="proj-blurb">{p.blurb}</p>
                  <div className="proj-tags">
                    {p.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}
                  </div>
                  {/* Inline thumbnail — shown only on touch / small screens. */}
                  {p.thumb && <img className="proj-thumb-inline" src={asset(p.thumb)} alt={p.name} loading="lazy" />}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Hover preview, parked on the right side of the screen (desktop). */}
      <AnimatePresence>
        {active !== null && projects[active].thumb && (
          <motion.img
            key={active}
            className="side-preview"
            src={asset(projects[active].thumb)}
            alt=""
            aria-hidden
            initial={{ opacity: 0, x: 40, y: '-50%' }}
            animate={{ opacity: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, x: 40, y: '-50%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <ProjectModal slug={openSlug} onClose={() => setOpenSlug(null)} />
    </section>
  )
}
