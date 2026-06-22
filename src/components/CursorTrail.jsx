import { useEffect, useRef } from 'react'

// A little comet-tail of silver twinkling stars that trails behind the cursor.
// Each star eases toward the one ahead of it (a "follow the leader" chain), so
// they spread out into a tail while moving and gather when still. The head
// chases the pointer. Transform/opacity only (GPU), disabled on touch.
const COUNT = 6

export default function CursorTrail() {
  const refs = useRef([])

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const els = refs.current.filter(Boolean)
    if (els.length !== COUNT) return

    const pts = els.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }))
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let raf = 0
    let seen = false

    const tick = () => {
      let px = tx
      let py = ty
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x += (px - p.x) * 0.34 // ease toward the star ahead -> trailing tail
        p.y += (py - p.y) * 0.34
        const scale = 1 - (i / (COUNT + 1)) // stars shrink toward the tail
        els[i].style.transform = `translate3d(${p.x - 8}px, ${p.y - 8}px, 0) scale(${scale})`
        px = p.x
        py = p.y
      }
      raf = requestAnimationFrame(tick)
    }
    const reveal = () => {
      els.forEach((el, i) => { el.style.opacity = String(0.95 - (i / COUNT) * 0.7) })
    }
    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) { seen = true; reveal() }
    }
    const hide = () => els.forEach((el) => { el.style.opacity = '0' })
    const show = () => { if (seen) reveal() }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
    }
  }, [])

  return (
    <div className="cursor-trail" aria-hidden>
      {Array.from({ length: COUNT }).map((_, i) => (
        <span
          key={i}
          className="trail-star"
          ref={(el) => { refs.current[i] = el }}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <defs>
              <radialGradient id="starShine" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#dfe6f3" />
                <stop offset="100%" stopColor="#9fb0cc" />
              </radialGradient>
            </defs>
            <path
              d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z"
              fill="url(#starShine)"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}
