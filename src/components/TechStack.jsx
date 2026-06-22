import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { techStack } from '../data/content.js'
import LogoTile from './LogoTile.jsx'

const ITEM_W = 92 // approx logo (46px) + margin (46px)

// One horizontal marquee row per category, alternating scroll direction.
// Each "half" of the track is repeated enough times to exceed the viewport
// width, so the row always spans edge-to-edge and the -50% loop is seamless.
function Marquee({ items, toRight }) {
  const [perHalf, setPerHalf] = useState(2)

  useEffect(() => {
    const calc = () => {
      const need = (window.innerWidth * 1.3) / (items.length * ITEM_W)
      setPerHalf(Math.max(2, Math.ceil(need)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [items.length])

  const half = Array.from({ length: perHalf }).flatMap(() => items)
  const track = [...half, ...half] // two identical halves -> seamless at -50%
  const dur = Math.max(24, half.length * 1.4)

  return (
    <div className="marquee">
      <ul
        className={`marquee-track ${toRight ? 'to-right' : ''}`}
        style={{ '--dur': `${dur}s` }}
      >
        {track.map((t, i) => (
          <li className="marquee-item" key={`${t.key}-${i}`}>
            <LogoTile icon={t.key} file={t.file} label={t.label} className="tech-logo" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TechStack() {
  return (
    <section className="section tech-section" id="stack">
      <div className="wrap">
        <p className="eyebrow">Stack</p>
      </div>
      <div className="tech-rows">
        {techStack.map((cat, i) => (
          <motion.div
            className="tech-group"
            key={cat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
          >
            <div className="wrap">
              <p className="tech-cat">{cat.label}</p>
            </div>
            <Marquee items={cat.items} toRight={i % 2 === 0} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
