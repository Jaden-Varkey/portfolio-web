import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectDetails } from '../data/content.js'
import ProjectDetailContent from './ProjectDetailContent.jsx'
import '../styles/detail.css'

// In-page project case study, framed as a space-shuttle mission dossier.
// The shuttle streaks in from the bottom-right like a shooting star — tiny,
// tilted nose-first with its exhaust trailing — growing as it crosses the
// screen, then pitching upright to hover over its pad (bottom-left), engines
// idling. Dismissing it — the Lift off switch, backdrop click, or Escape —
// throttles up and launches it straight up and out of the screen. Locks the
// page scroll while open.

// Flight path: % terms are relative to the craft's own size, so the calc()
// positions hold for any panel width/height. Every keyframe of a property
// keeps the same calc() shape so framer-motion can interpolate them.
const TO_ORBIT = 'calc(-140vh + 0%)'

export default function ProjectModal({ slug, onClose }) {
  const p = slug ? projectDetails[slug] : null
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState('landing') // landing -> docked -> leaving

  const liftOff = useCallback(() => {
    setPhase('leaving')
    onClose()
  }, [onClose])

  // reset the flight sequence each time a dossier opens
  useEffect(() => { if (p) setPhase('landing') }, [p])

  useEffect(() => {
    if (!p) return
    const onKey = (e) => { if (e.key === 'Escape') liftOff() }
    document.addEventListener('keydown', onKey)
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden' // root is the scroller (carries scroll-snap)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prev
    }
  }, [p, liftOff])

  const flight = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      }
    : {
        initial: {
          x: 'calc(104vw - 50% - 30px)',
          y: 'calc(-6vh + 30%)',
          scale: 0.14,
          rotate: -74,
          opacity: 0,
        },
        animate: {
          x: 'calc(0vw - 0% - 0px)',
          y: ['calc(-6vh + 30%)', 'calc(-13vh + 14%)', 'calc(0vh + 0%)'],
          scale: 1,
          rotate: 0,
          opacity: 1,
          // one continuous glide: each property runs the full flight with its
          // own curve, so nothing changes direction at a keyframe boundary.
          // The rotation's slow-start ease keeps the craft tilted while it is
          // fast, then curls it upright smoothly as it brakes into the pad.
          transition: {
            duration: 1.5,
            x: { duration: 1.5, ease: [0.3, 0.85, 0.25, 1] },
            y: { duration: 1.5, times: [0, 0.5, 1], ease: ['easeOut', 'easeInOut'] },
            scale: { duration: 1.5, ease: [0.35, 0.8, 0.3, 1] },
            rotate: { duration: 1.5, ease: [0.55, 0, 0.2, 1] },
            opacity: { duration: 0.25, ease: 'easeOut' },
          },
        },
        exit: {
          y: TO_ORBIT,
          transition: { duration: 0.75, ease: [0.62, 0, 0.86, 0.35] },
        },
      }

  const engine = (
    <>
      <i className="pm-bell" />
      <i className="pm-flame pm-flame-outer" />
      <i className="pm-flame pm-flame-inner" />
    </>
  )

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="pm-overlay"
          onClick={liftOff}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{
            // hold the backdrop until the shuttle has climbed out — the craft
            // is a child of the backdrop, so an early fade hides the launch
            opacity: 0,
            transition: { duration: 0.3, delay: reduceMotion ? 0 : 0.5, ease: 'easeIn' },
          }}
        >
          <motion.div
            className={`pm-launch ${phase === 'docked' ? 'is-docked' : 'is-flying'}`}
            onClick={(e) => e.stopPropagation()}
            onAnimationComplete={() => setPhase((ph) => (ph === 'landing' ? 'docked' : ph))}
            {...flight}
          >
            <div className="pm-craft" role="dialog" aria-modal="true" aria-label={p.name}>
              <span className="pm-fin" aria-hidden />
              <span className="pm-wing pm-wing-l" aria-hidden />
              <span className="pm-wing pm-wing-r" aria-hidden />
              <div className="pm-panel">
                <div className="pm-nose" aria-hidden>
                  <span className="pm-windows"><i /><i /><i /><i /></span>
                </div>
                <div className="pm-head">
                  <span className="pm-lights" aria-hidden><i /><i /><i /></span>
                  <span className="pm-label">◇ Mission Dossier</span>
                  <button className="pm-liftoff" onClick={liftOff} aria-label="Close">
                    <span className="pm-liftoff-icon" aria-hidden>▲</span>
                    Lift off
                  </button>
                </div>
                <div className="pm-body">
                  <ProjectDetailContent p={p} />
                </div>
              </div>
              <div className="pm-aft" aria-hidden>
                <span className="pm-aft-plate" />
                <span className="pm-engine pm-engine-l">{engine}</span>
                <span className="pm-engine pm-engine-c">{engine}</span>
                <span className="pm-engine pm-engine-r">{engine}</span>
                <span className="pm-exhaust" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
