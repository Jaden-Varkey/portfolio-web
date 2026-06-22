import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/content.js'
import { asset } from '../lib/asset.js'
import ProjectModal from './ProjectModal.jsx'

export default function Projects() {
  const [active, setActive] = useState(null) // index being hovered
  const [openSlug, setOpenSlug] = useState(null) // project shown in the modal

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <p className="eyebrow">Projects</p>
        <ul className="proj-list">
          {projects.map((p, i) => {
            const Row = p.slug ? 'button' : 'div'
            const rowProps = p.slug
              ? { type: 'button', onClick: () => setOpenSlug(p.slug) }
              : {}
            return (
              <motion.li
                key={p.name}
                className="proj-item"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <Row className={`proj-row ${p.slug ? 'is-link' : ''}`} {...rowProps}>
                  <div className="proj-head">
                    <h3 className="proj-name gradient-text">{p.name}</h3>
                    {p.slug && <span className="proj-arrow" aria-hidden>↗</span>}
                  </div>
                  <p className="proj-blurb">{p.blurb}</p>
                  <div className="proj-tags">
                    {p.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}
                  </div>
                  {/* Inline thumbnail — shown only on touch / small screens. */}
                  <img className="proj-thumb-inline" src={asset(p.thumb)} alt={p.name} loading="lazy" />
                </Row>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* Hover preview, parked on the right side of the screen (desktop). */}
      <AnimatePresence>
        {active !== null && (
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
