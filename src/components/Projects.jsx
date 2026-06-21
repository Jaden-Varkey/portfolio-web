import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { projects } from '../data/content.js'

export default function Projects() {
  const [active, setActive] = useState(null) // index being hovered

  // Floating preview follows the cursor (desktop only, pointer: fine).
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.6 })
  const y = useSpring(my, { stiffness: 350, damping: 30, mass: 0.6 })

  const handleMove = (e) => {
    mx.set(e.clientX + 24)
    my.set(e.clientY - 90)
  }

  return (
    <section className="section" id="projects" onMouseMove={handleMove}>
      <div className="wrap">
        <p className="eyebrow">Projects</p>
        <ul className="proj-list">
          {projects.map((p, i) => {
            const Row = p.slug ? Link : 'div'
            const rowProps = p.slug ? { to: `/projects/${p.slug}` } : {}
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
                  <img className="proj-thumb-inline" src={p.thumb} alt={p.name} loading="lazy" />
                </Row>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* Floating cursor preview (desktop). */}
      <AnimatePresence>
        {active !== null && (
          <motion.img
            key={active}
            className="cursor-preview"
            src={projects[active].thumb}
            alt=""
            aria-hidden
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
