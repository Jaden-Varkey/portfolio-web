import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

// Scroll-driven warp between Projects and Experience.
//
// The section is 300vh tall and pins its first viewport, so ~2 viewports of
// wheel travel are spent "in flight" rather than scrolling past content. The
// canvas is a star tunnel: each star holds a fixed (x, y) direction and a depth
// that the scroll offset walks toward the camera, so stars stream outward and
// stretch into streaks as you go. Progress is written to a ref and read by one
// rAF loop — routing it through React state would re-render on every frame.
//
// The pinned layer is opaque, so the flight also covers the Earth backdrop:
// you leave the planet, cross open space, and arrive at the work history.

const STAR_COUNT = 420
const FOCAL = 340
const SPREAD = 2.2

function makeStars() {
  const stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    // Reject the dead centre so nothing sits on the vanishing point.
    let x = 0
    let y = 0
    while (Math.hypot(x, y) < 0.12) {
      x = (Math.random() * 2 - 1) * SPREAD
      y = (Math.random() * 2 - 1) * SPREAD
    }
    stars.push({ x, y, z0: Math.random(), hue: Math.random() })
  }
  return stars
}

// `intensity` scales how much depth the flight covers, so the three crossings
// don't feel like the same clip replayed — the middle one is the long haul.
export default function WarpTransition({ kicker, title, accent, intensity = 1, className = '' }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const intensityRef = useRef(intensity)
  intensityRef.current = intensity
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Headline rides the middle of the flight.
  const copyOpacity = useTransform(scrollYProgress, [0.06, 0.24, 0.72, 0.92], [0, 1, 1, 0])
  const copyScale = useTransform(scrollYProgress, [0, 1], [0.86, 1.28])
  const copyBlur = useTransform(scrollYProgress, [0.72, 0.92], ['blur(0px)', 'blur(10px)'])
  // The blackout has to be a fade, not a slide. The pinned layer is a full
  // viewport tall, so painting it opaque meant a dark panel visibly sliding in
  // over the lit planet on the way in and back off on the way out. Fading it
  // means the planet and stars dissolve into the tunnel instead.
  const veil = useTransform(scrollYProgress, [0, 0.20, 0.80, 1], [0, 1, 1, 0])

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => { progressRef.current = v })
    progressRef.current = scrollYProgress.get()
    return unsub
  }, [scrollYProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const stars = makeStars()
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const p = progressRef.current
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2

      // Travel accelerates: the back half of the section covers far more depth
      // than the front, which is what sells it as speeding up rather than
      // panning at a constant rate.
      const travel = p * p * 3.4 * intensityRef.current
      // Streaks start as points and stretch as the camera speeds up.
      const streak = 0.006 + p * 0.075 * intensityRef.current
      // Ease the whole field in and out so neither edge is a hard cut.
      const envelope = Math.min(1, p / 0.08) * Math.min(1, (1 - p) / 0.06)

      ctx.lineCap = 'round'
      for (const s of stars) {
        // Wrap depth into (0,1] so stars recycle seamlessly and the effect
        // still works when scrolling back up.
        let z = (s.z0 - travel) % 1
        if (z <= 0) z += 1
        if (z < 0.02) continue

        const zb = z + streak
        const sx = cx + (s.x / z) * FOCAL
        const sy = cy + (s.y / z) * FOCAL
        const bx = cx + (s.x / zb) * FOCAL
        const by = cy + (s.y / zb) * FOCAL

        if (sx < -200 && bx < -200) continue
        if (sx > w + 200 && bx > w + 200) continue
        if (sy < -200 && by < -200) continue
        if (sy > h + 200 && by > h + 200) continue

        const near = 1 - z
        const alpha = Math.min(1, near * near * 1.5) * envelope
        if (alpha <= 0.01) continue

        // Mostly white, with a few in the site's amber and cyan.
        ctx.strokeStyle =
          s.hue > 0.9 ? `rgba(245,177,68,${alpha})`
          : s.hue > 0.8 ? `rgba(0,212,255,${alpha})`
          : `rgba(255,255,255,${alpha})`
        ctx.lineWidth = 0.5 + near * 2
        ctx.beginPath()
        ctx.moveTo(bx, by)
        ctx.lineTo(sx, sy)
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }

    if (reduced) {
      // One static frame: no motion, but the section still reads as space.
      progressRef.current = 0.3
      draw()
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <section className={`warp ${className}`} ref={sectionRef} aria-hidden>
      <div className="warp-pin">
        <motion.div className="warp-veil" style={{ opacity: veil }} />
        <canvas className="warp-canvas" ref={canvasRef} />
        <motion.div
          className="warp-copy"
          style={{ opacity: copyOpacity, scale: copyScale, filter: copyBlur }}
        >
          <p className="warp-kicker">{kicker}</p>
          <h2 className="warp-title">
            {title} <span className="gradient-text">{accent}</span>
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
