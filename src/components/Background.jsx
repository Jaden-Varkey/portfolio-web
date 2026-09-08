import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, motion, useSpring } from 'motion/react'
import Starfield from './Starfield.jsx'
import Planet from './Planet.jsx'

// The fixed backdrop: a live WebGL planet, a starfield, and a legibility veil.
//
// The planet replaces what used to be a still photo with parallax. It sits
// underneath the still, which stays in the tree as the fallback for browsers
// with no WebGL2 — Planet adds `is-live` to its canvas once it has actually
// compiled and linked, and that class fades the photo out. If the shader never
// runs, or the context is lost later, the photo is simply still there.
//
// Scroll is handed down through refs rather than state: the shader reads it
// once per frame, and a re-render per scroll event would be pointless work.
export default function Background() {
  const { scrollYProgress } = useScroll()
  const scrollRef = useRef(0)
  const departRef = useRef(0)
  const [planetLive, setPlanetLive] = useState(false)

  // Deeper parallax: more pan + zoom = stronger "moving through it".
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-10%', '12%'])
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.12, 1.32])
  const y = useSpring(yRaw, { stiffness: 80, damping: 30, mass: 0.5 })
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 30, mass: 0.5 })

  // Veil gets slightly denser as you scroll into the text sections.
  const veil = useTransform(scrollYProgress, [0, 0.18, 1], [0.45, 0.72, 0.82])

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => { scrollRef.current = v })
    scrollRef.current = scrollYProgress.get()
    return unsub
  }, [scrollYProgress])

  // While a warp is pinned, hand the screen over to it: the planet shrinks and
  // dims so the two effects read as one departure rather than a cut. There are
  // several crossings now, so this takes whichever is furthest along — and it
  // stays at 1 afterwards, because once you have left the planet you have left
  // it. The moons in the shader are what carry the rest of the page.
  useEffect(() => {
    const warps = Array.from(document.querySelectorAll('.warp'))
    if (!warps.length) return
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      let d = 0
      for (const w of warps) {
        const r = w.getBoundingClientRect()
        const span = r.height - window.innerHeight
        if (span <= 0) continue
        d = Math.max(d, Math.min(1, Math.max(0, (-r.top) / span) * 1.35))
      }
      departRef.current = d
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const bgUrl = `${import.meta.env.BASE_URL}bg/hero-bg.jpg`

  return (
    <div className="bg-fixed" aria-hidden>
      <motion.div
        className={`bg-image ${planetLive ? 'is-hidden' : ''}`}
        style={{ y, scale, backgroundImage: `url(${bgUrl})` }}
      />
      <Starfield />
      {/* Above the starfield: the planet is opaque where it covers, so stars
          pass behind it rather than through it. */}
      <Planet
        scrollRef={scrollRef}
        departRef={departRef}
        onReady={() => setPlanetLive(true)}
        onLost={() => setPlanetLive(false)}
      />
      <motion.div className="bg-veil" style={{ opacity: veil }} />
      <div className="bg-grain" />
    </div>
  )
}
