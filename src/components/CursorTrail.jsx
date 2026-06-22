import { useEffect, useRef } from 'react'

// A small soft dot that trails behind the cursor — like the rocket's exhaust.
// It eases toward the pointer each frame (lerp), so it lags slightly and reads
// as a little trailing wisp. Transform-only (GPU), disabled on touch.
export default function CursorTrail() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf = 0
    let seen = false

    const tick = () => {
      x += (tx - x) * 0.18 // ease toward the cursor -> trails behind it
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) { seen = true; el.style.opacity = '1' }
    }
    const hide = () => { el.style.opacity = '0' }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', hide)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
    }
  }, [])

  return <div className="cursor-trail" ref={ref} aria-hidden />
}
