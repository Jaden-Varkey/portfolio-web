import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { loadContributions, monthLabels, toWeeks } from '../lib/contributions.js'

// A GitHub-style contribution calendar that rides just above the cursor while
// the GitHub icon is hovered. Mounted once at the app root (like <Cursor />)
// and driven by delegated listeners, so every `[data-contrib]` link shares one
// instance instead of each social row owning its own copy.
const TRIGGER = '[data-contrib]'
const GAP = 18 // clearance between the cursor hotspot and the card's bottom edge

export default function ContribGraph() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const anchorRef = useRef(null)
  const pointRef = useRef({ x: 0, y: 0 })

  // Follow the pointer by writing transform directly — a state update per
  // mousemove would re-render the whole grid. Positioning lives on the anchor
  // rather than the card itself, because the card's own transform belongs to
  // the open/close animation and would overwrite it.
  const place = () => {
    const el = anchorRef.current
    if (!el) return
    const { x, y } = pointRef.current
    const width = el.offsetWidth // layout size, unaffected by the card's scale
    const height = el.offsetHeight
    const left = Math.min(Math.max(x - width / 2, 12), window.innerWidth - width - 12)
    const top = Math.max(y - height - GAP, 12)
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`
  }

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const show = (x, y) => {
      pointRef.current = { x, y }
      setOpen(true)
      loadContributions().then(setData).catch(() => setFailed(true))
    }

    const over = (e) => {
      const trigger = e.target.closest?.(TRIGGER)
      if (!trigger) return
      show(e.clientX, e.clientY)
    }
    const out = (e) => {
      if (!e.target.closest?.(TRIGGER)) return
      if (e.relatedTarget?.closest?.(TRIGGER)) return
      setOpen(false)
    }
    const move = (e) => {
      if (!e.target.closest?.(TRIGGER)) return
      pointRef.current = { x: e.clientX, y: e.clientY }
      place()
    }
    // Keyboard parity: anchor to the link itself when it receives focus.
    const focusIn = (e) => {
      const trigger = e.target.closest?.(TRIGGER)
      if (!trigger) return
      const r = trigger.getBoundingClientRect()
      show(r.left + r.width / 2, r.top)
    }
    const focusOut = (e) => {
      if (e.target.closest?.(TRIGGER)) setOpen(false)
    }

    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('focusin', focusIn)
    document.addEventListener('focusout', focusOut)
    const hide = () => setOpen(false)
    window.addEventListener('scroll', hide, { passive: true })
    return () => {
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('mousemove', move)
      document.removeEventListener('focusin', focusIn)
      document.removeEventListener('focusout', focusOut)
      window.removeEventListener('scroll', hide)
    }
  }, [])

  // Re-place once the card exists (and again when data swaps its height).
  useEffect(() => { if (open) place() }, [open, data, failed])

  const weeks = data ? toWeeks(data.days) : null
  const months = weeks ? monthLabels(weeks) : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="contrib-anchor" ref={anchorRef} aria-hidden>
          <motion.div
            className="contrib-card"
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contrib-head">
              <span className="contrib-user">@{data?.user || 'Jaden-Varkey'}</span>
              <span className="contrib-total">
                {failed
                  ? 'contributions unavailable'
                  : data
                    ? `${data.total.toLocaleString()} contributions in ${data.year}`
                    : 'loading…'}
              </span>
            </div>

            <div className="contrib-body">
              {weeks ? (
                <>
                  <div className="contrib-months">
                    {months.map((m) => (
                      <span key={m.col} className="contrib-month" style={{ '--col': m.col }}>{m.name}</span>
                    ))}
                  </div>
                  <div className="contrib-grid">
                    {weeks.map((week, col) => (
                      <div key={col} className="contrib-week" style={{ '--col': col }}>
                        {week.map((day, row) => (
                          <span
                            key={day ? day.d : `pad-${row}`}
                            className={day ? `contrib-day l${day.l}` : 'contrib-day is-pad'}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={`contrib-skeleton ${failed ? 'is-failed' : ''}`} />
              )}
            </div>

            <div className="contrib-legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`contrib-day l${l}`} />)}
              <span>More</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
