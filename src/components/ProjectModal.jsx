import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { projectDetails } from '../data/content.js'
import ProjectDetailContent from './ProjectDetailContent.jsx'
import '../styles/detail.css'

// In-page project case study, framed as a craft rather than drawn as one.
//
// The old version modelled a literal shuttle out of clip-paths — delta wings,
// a cockpit window strip, three engine bells with flame cones — and flew it in
// from the corner at 14% scale. At that size a modelled ship can only read as
// clipart, and the arc had nothing to do with the thing you actually clicked.
//
// This one keeps the launch language but carries it in light instead of parts:
// the dossier is a slab of dark glass that rises out of the card you clicked,
// holds over a column of thrust, and climbs out of frame when dismissed. The
// rim catches a moving highlight, embers drift off the base, and starlight
// streaks past on the way in — the same vocabulary the planet shader and the
// warp sections already speak.
//
// Arrival is a FLIP from the card's own rectangle, which is what makes it read
// as one continuous move rather than a modal appearing on top of a page.

// The craft starts at rest on the card, so the rise breaks away slowly, builds,
// and decelerates onto the pad — an ease-out alone puts it at its destination
// in the first third and then crawls, which is what made the old flight read as
// a panel snapping into place. Departure is the same curve reversed: it winds
// up and is gone.
const RISE = [0.45, 0, 0.18, 1]
const CLIMB = [0.6, 0, 0.92, 0.36]
const RISE_MS = 760
const CLIMB_MS = 640

const STREAKS = [8, 23, 38, 57, 71, 86, 94]
const MOTES = [0, 1, 2, 3, 4, 5, 6]

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi)

// Where the craft starts its rise, in the docked element's own coordinates.
// With no origin rect (a deep link, say) it simply lifts from below.
function entryFrom(origin, dock) {
  if (!origin || !dock.width || !dock.height) {
    return { x: 0, y: Math.min(window.innerHeight * 0.42, 420), scale: 0.88 }
  }
  // Match the card's width outright — the craft should leave the pad at the
  // size of the thing that was clicked. The bounds only catch the extremes (a
  // narrow card on a wide viewport, or the reverse).
  return {
    x: origin.left + origin.width / 2 - (dock.left + dock.width / 2),
    y: origin.top + origin.height / 2 - (dock.top + dock.height / 2),
    scale: clamp(origin.width / dock.width, 0.2, 1.15),
  }
}

export default function ProjectModal({ slug, origin, onClose }) {
  const p = slug ? projectDetails[slug] : null
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState('flying') // flying -> docked -> leaving
  const launchRef = useRef(null)
  const closingRef = useRef(false)

  // Driven imperatively rather than through AnimatePresence variants: the
  // entry offset isn't known until the docked element has been measured, and
  // the exit has to sequence the craft's climb ahead of the backdrop fade.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(0)
  const veil = useMotionValue(0)

  const liftOff = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setPhase('leaving')

    const done = () => {
      closingRef.current = false
      x.set(0); y.set(0); scale.set(1); opacity.set(0)
      setPhase('flying')
      onClose()
    }

    if (reduce) {
      animate(opacity, 0, { duration: 0.2, ease: 'easeIn' })
      animate(veil, 0, { duration: 0.26, ease: 'easeIn', onComplete: done })
      return
    }
    // The craft leaves first; the backdrop only lets go once it has cleared
    // the frame, so the exit reads as a departure rather than a dismissal.
    animate(y, -window.innerHeight * 1.2, { duration: CLIMB_MS / 1000, ease: CLIMB })
    animate(scale, 0.9, { duration: CLIMB_MS / 1000, ease: CLIMB })
    animate(opacity, 0, { duration: 0.3, delay: 0.32, ease: 'easeIn' })
    animate(veil, 0, { duration: 0.34, delay: 0.28, ease: 'easeIn', onComplete: done })
  }, [onClose, reduce, x, y, scale, opacity, veil])

  // Measure the docked rectangle, then start the craft at the card's. Runs in
  // a layout effect and writes the opening transform inline as well as to the
  // motion values, so the first painted frame is already the small one.
  useLayoutEffect(() => {
    if (!slug) return
    const el = launchRef.current
    if (!el) return

    setPhase('flying')
    if (reduce) {
      x.set(0); y.set(0); scale.set(1); opacity.set(1); veil.set(1)
      setPhase('docked')
      return
    }

    el.style.transform = 'none'
    const from = entryFrom(origin, el.getBoundingClientRect())
    el.style.transform = `translate(${from.x}px, ${from.y}px) scale(${from.scale})`
    el.style.opacity = '0'
    x.set(from.x); y.set(from.y); scale.set(from.scale); opacity.set(0); veil.set(0)

    const s = RISE_MS / 1000
    animate(veil, 1, { duration: 0.42, ease: 'easeOut' })
    animate(opacity, 1, { duration: 0.34, ease: 'easeOut' })
    animate(x, 0, { duration: s, ease: RISE })
    animate(scale, 1, { duration: s, ease: RISE })
    animate(y, 0, {
      duration: s,
      ease: RISE,
      onComplete: () => { if (!closingRef.current) setPhase('docked') },
    })
    // origin is captured with the slug; re-running on its identity alone would
    // restart a flight already in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    if (!p) return
    const onKey = (e) => { if (e.key === 'Escape') liftOff() }
    document.addEventListener('keydown', onKey)
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden' // root is the scroller
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prev
    }
  }, [p, liftOff])

  if (!p) return null

  return (
    <motion.div
      className={`pm-overlay is-${phase}`}
      style={{ opacity: veil }}
      onClick={liftOff}
    >
      {/* starlight pulled past the craft while it is under power */}
      <div className="pm-field" aria-hidden>
        {STREAKS.map((left, i) => (
          <i key={left} style={{ '--x': left, '--d': `${i * 0.09}s` }} />
        ))}
      </div>

      <div className="pm-dock">
        <motion.div
          ref={launchRef}
          className="pm-launch"
          style={{ x, y, scale, opacity }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pm-craft">
            <span className="pm-aura" aria-hidden />

            <div className="pm-hull" role="dialog" aria-modal="true" aria-label={p.name}>
              <span className="pm-rim" aria-hidden />
              <span className="pm-sensor" aria-hidden />
              <div className="pm-head">
                <span className="pm-label">Mission dossier</span>
                <button className="pm-liftoff" onClick={liftOff} aria-label="Close">
                  <span className="pm-liftoff-icon" aria-hidden />
                  Lift off
                </button>
              </div>
              <div className="pm-body">
                <ProjectDetailContent p={p} />
              </div>
            </div>

            {/* aft: a tapered keel closing the silhouette, and the vent the
                thrust actually comes out of */}
            <div className="pm-aft" aria-hidden>
              <span className="pm-keel" />
              <span className="pm-vent" />
            </div>

            <div className="pm-thrust" aria-hidden>
              <span className="pm-plume" />
              <span className="pm-plume pm-plume-core" />
              <span className="pm-motes">
                {MOTES.map((i) => <i key={i} style={{ '--i': i }} />)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
