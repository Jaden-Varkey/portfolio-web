import { useEffect, useState } from 'react'
import { useScroll, useTransform, motion, useSpring } from 'framer-motion'
import Starfield from './Starfield.jsx'

// Fixed background image with a scroll-driven parallax pan + zoom (so scrolling
// reads as descending *through* the image), a dark veil for legibility, and a
// "warp" streak layer that flashes on every section change (snap). All work is
// transform/opacity on the GPU — no jank.
export default function Background() {
  const { scrollYProgress } = useScroll()

  // Deeper parallax: more pan + zoom = stronger "moving through it".
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-10%', '12%'])
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.12, 1.32])
  const y = useSpring(yRaw, { stiffness: 80, damping: 30, mass: 0.5 })
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 30, mass: 0.5 })

  // Veil gets slightly denser as you scroll into the text sections.
  const veil = useTransform(scrollYProgress, [0, 0.18, 1], [0.45, 0.72, 0.82])

  // Fire a warp flash whenever the most-visible section changes (a snap).
  const [flash, setFlash] = useState(0)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.hero, .section'))
    if (!els.length) return
    const ratios = new Map()
    let current = els[0]
    let first = true
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio))
        let best = current
        let bestR = -1
        ratios.forEach((r, el) => { if (r > bestR) { bestR = r; best = el } })
        if (best !== current) {
          current = best
          if (first) first = false
          else setFlash((f) => f + 1)
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const bgUrl = `${import.meta.env.BASE_URL}bg/hero-bg.jpg`

  return (
    <div className="bg-fixed" aria-hidden>
      <motion.div className="bg-image" style={{ y, scale, backgroundImage: `url(${bgUrl})` }} />
      <motion.div className="bg-veil" style={{ opacity: veil }} />
      <Starfield />
      {/* key change remounts the element so the CSS flash replays on each snap */}
      {flash > 0 && <div className="bg-warp" key={flash} />}
      <div className="bg-grain" />
    </div>
  )
}
