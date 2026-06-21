import { useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { experience } from '../data/content.js'

export default function Experience() {
  const [preview, setPreview] = useState(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.6 })
  const y = useSpring(my, { stiffness: 350, damping: 30, mass: 0.6 })
  const handleMove = (ev) => { mx.set(ev.clientX + 24); my.set(ev.clientY - 90) }

  return (
    <section className="section" id="experience" onMouseMove={handleMove}>
      <div className="wrap">
        <p className="eyebrow">Experience</p>
        <div className="exp-list">
          {experience.map((e) => (
            <motion.div
              key={e.company}
              className="exp-row"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => e.thumb && setPreview(e.thumb)}
              onMouseLeave={() => setPreview(null)}
            >
              <div className="exp-main">
                <h3 className="exp-company gradient-text">{e.company}</h3>
                <p className="exp-role">{e.role}</p>
                <p className="exp-line">{e.line}</p>
                {e.thumb && <img className="exp-thumb-inline" src={e.thumb} alt={e.company} loading="lazy" />}
              </div>
              <div className="exp-aside">
                <span className="exp-date">{e.date}</span>
                <span className="exp-loc">{e.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.img
            key={preview}
            className="cursor-preview"
            src={preview}
            alt=""
            aria-hidden
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
