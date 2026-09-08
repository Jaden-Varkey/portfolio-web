import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react'
import { projects } from '../data/content.js'
import { asset } from '../lib/asset.js'
import ProjectModal from './ProjectModal.jsx'

// Projects run sideways: the section pins its first viewport and converts
// vertical scroll into horizontal travel along the track, then releases back to
// normal vertical scrolling at the end.
//
// The section's height is derived from the measured overflow rather than a
// guessed multiple of the viewport, so one pixel of wheel is one pixel of
// sideways travel — the movement tracks the wheel exactly instead of drifting
// with the number of cards or the width of the window.
//
// Below `HORIZONTAL_MIN` the whole mechanic is dropped and the cards stack
// vertically: pinned horizontal scrolling on a phone fights the scroll
// direction the gesture implies.
const HORIZONTAL_MIN = 900
// Vertical scroll held at each end before and after the sideways travel, so the
// section doesn't flip straight back to vertical the moment the last card
// lands. Reads as a beat rather than a hard handoff.
const LEAD_IN = 260
const LEAD_OUT = 340

export default function Projects() {
  const [active, setActive] = useState(null)
  const [openSlug, setOpenSlug] = useState(null)
  const [overflow, setOverflow] = useState(0)
  const [horizontal, setHorizontal] = useState(false)

  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const measure = () => {
      const on = window.innerWidth >= HORIZONTAL_MIN
      setHorizontal(on)
      const track = trackRef.current
      if (!on || !track) { setOverflow(0); return }
      setOverflow(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    // Card widths depend on fonts and images that land after first paint.
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => { window.removeEventListener('resize', measure); ro.disconnect() }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Total pinned travel is the hold, the sideways distance, then the hold
  // again — so progress maps to a flat / move / flat curve rather than moving
  // for the section's entire length.
  const total = LEAD_IN + overflow + LEAD_OUT
  const a = total > 0 ? LEAD_IN / total : 0
  const b = total > 0 ? (LEAD_IN + overflow) / total : 1
  const xRaw = useTransform(scrollYProgress, [0, a, b, 1], [0, 0, -overflow, -overflow])
  // A little spring keeps the track from feeling mechanically welded to the
  // wheel without introducing enough lag to desync from the pin.
  const x = useSpring(xRaw, { stiffness: 220, damping: 40, mass: 0.4 })

  return (
    <section
      className={`section proj-section ${horizontal ? 'is-horizontal' : ''}`}
      id="projects"
      ref={sectionRef}
      style={horizontal ? { height: `calc(100vh + ${total}px)` } : undefined}
    >
      <div className="proj-pin">
        <div className="wrap proj-wrap">
          <div className="section-head">
            <p className="eyebrow">01 / Projects</p>
            <h2 className="section-title">Projects</h2>
          </div>
        </div>

        <motion.div
          className="proj-track"
          ref={trackRef}
          style={horizontal ? { x } : undefined}
        >
          {projects.map((p, i) => {
            const Card = p.slug ? 'button' : 'div'
            const cardProps = p.slug
              ? { type: 'button', onClick: () => setOpenSlug(p.slug) }
              : {}
            return (
              <motion.div
                key={p.name}
                className={`proj-grid-item ${i === 0 ? 'feature' : ''}`}
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
          {/* Real element rather than padding-right: flex containers don't
              reliably include trailing padding in scrollWidth, and the overflow
              measurement depends on it. */}
          <div className="proj-rail-end" aria-hidden />
        </motion.div>
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
