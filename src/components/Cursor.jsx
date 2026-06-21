import { useEffect, useRef } from 'react'

// Custom spaceship cursor. Follows the mouse via transform (no layout, no lag).
// When hovering an interactive element it ignites and shoots flames.
const INTERACTIVE = 'a, button, [role="button"], input, label, ' +
  '.proj-row.is-link, .social-link, .marquee-item, .exp-row, .detail-btn'

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
          <g className="ship-body">
            {/* flames (behind the body) */}
            <path className="flame flame-outer" d="M15 24 Q18 36 21 24 Q18 27 15 24Z" fill="#ff7a1a" />
            <path className="flame flame-inner" d="M16.4 24 Q18 32 19.6 24 Q18 26 16.4 24Z" fill="#ffd34d" />
            {/* fins */}
            <path d="M14 19.5 L10.3 27 L14.6 24Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" />
            <path d="M22 19.5 L25.7 27 L21.4 24Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" />
            {/* fuselage */}
            <path d="M18 4 C22 9 22.6 19 20.6 24 H15.4 C13.4 19 14 9 18 4Z" fill="#eef1f8" stroke="#0c0e15" strokeWidth="1" />
            {/* window */}
            <circle cx="18" cy="12" r="2.3" fill="#3186ff" stroke="#0c0e15" strokeWidth="0.7" />
          </g>
        </g>
      </svg>
    </div>
  )
}
