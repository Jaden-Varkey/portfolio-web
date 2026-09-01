import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/content.js'
import Rocket from './Rocket.jsx'

// Pre-launch sequence intro, picking up the space language the rest of the site
// already speaks (the ship cursor, the starfield, the mission-dossier modal).
// A mission-control HUD counts down, the ship lifts off, and the cover splits
// along the seam it flew through to reveal the page. Runs once per page load.
const BOOT_MS = 1100 // countdown fill
const FLIGHT_MS = 560 // ship's climb off the pad
const DOORS_AT = 300 // into the climb, the bay doors start parting behind it
const DOOR_MS = 620 // bay doors sliding clear
// Backstop: the cover is removed outright by now, whatever the animations did.
const FAILSAFE_MS = BOOT_MS + DOORS_AT + DOOR_MS + 600

const STAGES = [
  { at: 0, label: 'INITIALIZING SYSTEMS' },
  { at: 32, label: 'FUELING BOOSTERS' },
  { at: 62, label: 'GUIDANCE LOCKED' },
  { at: 88, label: 'ALL SYSTEMS GO' },
]

const stageFor = (pct) => STAGES.reduce((cur, s) => (pct >= s.at ? s : cur), STAGES[0]).label

export default function PageIntro() {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('boot') // boot -> launch -> done
  const [gone, setGone] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Nothing to show someone who isn't looking: a tab opened in the background
    // gets no animation frames at all, so drop the cover rather than make them
    // sit through a launch they already waited out.
    if (document.hidden) {
      setGone(true)
      return
    }
    const onHide = () => { if (document.hidden) setGone(true) }
    document.addEventListener('visibilitychange', onHide)

    // However the animations behave, the cover comes off — it spans the whole
    // viewport, so a stuck one would lock the page out entirely.
    const failsafe = setTimeout(() => setGone(true), FAILSAFE_MS)

    if (reduced.current) {
      const t = setTimeout(() => setPhase('done'), 400)
      return () => {
        clearTimeout(t)
        clearTimeout(failsafe)
        document.removeEventListener('visibilitychange', onHide)
      }
    }

    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / BOOT_MS, 1)
      // ease-out so the counter races ahead early and settles on 100
      setPct(Math.round((1 - Math.pow(1 - p, 2)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Phase changes run on timers rather than off the back of the rAF loop: a
    // page opened in a background tab gets no animation frames at all, and the
    // cover still has to lift once that tab is brought forward.
    const toLaunch = setTimeout(() => {
      setPct(100)
      setPhase('launch')
    }, BOOT_MS)
    const toDone = setTimeout(() => setPhase('done'), BOOT_MS + DOORS_AT)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(toLaunch)
      clearTimeout(toDone)
      clearTimeout(failsafe)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  if (gone) return null

  const launching = phase === 'launch'
  // T-minus reads down to zero as the bar fills, then holds at liftoff.
  const tMinus = launching ? '00' : String(Math.max(0, Math.ceil((100 - pct) / 10))).padStart(2, '0')

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div className="intro-cover" exit={{ transition: { duration: 0 } }} aria-hidden>
          {/* bay doors — part along the seam the ship flew through */}
          <motion.div
            className="intro-door intro-door--top"
            exit={{ y: '-100%' }}
            transition={{ duration: DOOR_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="intro-door intro-door--bottom"
            exit={{ y: '100%' }}
            transition={{ duration: DOOR_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            className="intro-hud"
            animate={{ opacity: launching ? 0 : 1 }}
            transition={{ duration: 0.22 }}
          >
            <div className="intro-corner intro-corner--tl">MISSION · PORTFOLIO</div>
            <div className="intro-corner intro-corner--tr">T−{tMinus}</div>

            <div className="intro-center">
              <motion.span
                className="intro-name gradient-text"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {profile.name}
              </motion.span>

              <div className="intro-gauge">
                <div className="intro-bar">
                  <div className="intro-bar-fill" style={{ transform: `scaleX(${pct / 100})` }} />
                </div>
                <span className="intro-pct">{String(pct).padStart(3, '0')}%</span>
              </div>

              <div className="intro-status">{launching ? 'LIFTOFF' : stageFor(pct)}</div>
            </div>
          </motion.div>

          {/* the ship waits on the pad, then climbs out through the seam */}
          <div className="intro-pad" />
          <motion.div
            className={`intro-ship ${launching ? 'is-lit' : ''}`}
            initial={{ y: 8, opacity: 0 }}
            animate={launching ? { y: '-105vh', scale: 0.62 } : { y: 0, opacity: 1 }}
            transition={launching
              ? { duration: FLIGHT_MS / 1000, ease: [0.45, 0, 0.9, 0.4] }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 36 36" width="40" aria-hidden>
              <Rocket className="ship-body" />
            </svg>
          </motion.div>

          <div className={`intro-seam ${launching ? 'is-hot' : ''}`} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
