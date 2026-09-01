import { useEffect, useRef } from 'react'
import Rocket from './Rocket.jsx'

// Custom spaceship cursor. Follows the mouse via transform (no layout, no lag).
// When hovering an interactive element it ignites and shoots flames.
const INTERACTIVE = 'a, button, [role="button"], input, label, ' +
  '.proj-card.is-link, .social-link, .marquee-item, .detail-btn'

export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return // touch: keep native
    const el = ref.current
    if (!el) return
    document.documentElement.classList.add('has-custom-cursor')

    // Hotspot sits at the (rotated) nose, ~6px in from the top-left.
    const move = (e) => {
      el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
      const boost = !!(e.target.closest && e.target.closest(INTERACTIVE))
      el.classList.toggle('cursor--boost', boost)
    }
    const down = () => el.classList.add('cursor--press')
    const up = () => el.classList.remove('cursor--press')
    const hide = () => { el.style.opacity = '0' }
    const show = () => { el.style.opacity = '1' }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div className="cursor" ref={ref} aria-hidden>
      <svg viewBox="0 0 36 36" width="22">
        {/* slanted so the nose points up-left like a pointer */}
        <g transform="rotate(-45 18 18)">
          <Rocket className="ship-body" />
        </g>
      </svg>
    </div>
  )
}
