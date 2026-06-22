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
            <path className="flame flame-outer" d="M15.4 27 Q18 36 20.6 27 Q18 29.6 15.4 27Z" fill="#ff7a1a" />
            <path className="flame flame-inner" d="M16.7 27 Q18 33 19.3 27 Q18 29 16.7 27Z" fill="#ffd34d" />
            {/* swept-back fins */}
            <path d="M14 18 C11.6 20.2 10 23.2 10.4 26.4 L14 23.6Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
            <path d="M22 18 C24.4 20.2 26 23.2 25.6 26.4 L22 23.6Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
            {/* fuselage (pointed nose, rounded tail) */}
            <path d="M18 2.4 C21 7 22 12 22 16.5 C22 20.8 20.8 23.8 18 25.8 C15.2 23.8 14 20.8 14 16.5 C14 12 15 7 18 2.4Z" fill="#eef1f8" stroke="#0c0e15" strokeWidth="1" strokeLinejoin="round" />
            {/* red nose cone */}
            <path d="M18 2.4 C20 6 21 9 21 11.6 L15 11.6 C15 9 16 6 18 2.4Z" fill="#ff6f5e" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
            {/* nozzle */}
            <path d="M16 25.3 L20 25.3 L19 27.4 L17 27.4Z" fill="#c2c8d4" stroke="#0c0e15" strokeWidth="0.7" strokeLinejoin="round" />
            {/* porthole window */}
            <circle cx="18" cy="15.6" r="2.4" fill="#3186ff" stroke="#dfe6f3" strokeWidth="0.9" />
            <circle cx="18" cy="15.6" r="2.4" fill="none" stroke="#0c0e15" strokeWidth="0.5" />
          </g>
        </g>
      </svg>
    </div>
  )
}
