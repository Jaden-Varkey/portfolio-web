import { useEffect, useRef } from 'react'

// A soft radial glow that tracks the cursor. Painted above the background image
// but beneath the content, so it lifts the scene near the pointer without
// washing out text. Position is updated via a single rAF-throttled transform
// (GPU only — no layout, no jank).
export default function Spotlight() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return // touch: no glow
    const el = ref.current
    if (!el) return

    const SIZE = 760
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    const apply = () => {
      raf = 0
      el.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`
    }
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
      el.style.opacity = '1'
    }
    const hide = () => { el.style.opacity = '0' }

    apply()
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', hide)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="spotlight" ref={ref} aria-hidden />
}
