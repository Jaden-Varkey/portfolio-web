import { useScroll, useTransform, motion, useSpring } from 'framer-motion'

// Fixed background image with a smooth scroll-driven parallax pan + a dark veil
// so text stays readable. useScroll is rAF-based (no jank), and we only animate
// transform/opacity on the GPU.
export default function Background() {
  const { scrollYProgress } = useScroll()
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.08, 1.16])
  const y = useSpring(yRaw, { stiffness: 80, damping: 30, mass: 0.5 })
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 30, mass: 0.5 })

  // Veil gets slightly denser as you scroll into the text sections.
  const veil = useTransform(scrollYProgress, [0, 0.18, 1], [0.45, 0.72, 0.82])

  const bgUrl = `${import.meta.env.BASE_URL}bg/hero-bg.jpg`

  return (
    <div className="bg-fixed" aria-hidden>
      <motion.div className="bg-image" style={{ y, scale, backgroundImage: `url(${bgUrl})` }} />
      <motion.div className="bg-veil" style={{ opacity: veil }} />
      <div className="bg-grain" />
    </div>
  )
}
