import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { experience } from '../data/content.js'
import { asset } from '../lib/asset.js'

export default function Experience() {
  const [preview, setPreview] = useState(null)

  return (
    <section className="section" id="experience">
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
                {e.thumb && <img className="exp-thumb-inline" src={asset(e.thumb)} alt={e.company} loading="lazy" />}
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
            className="side-preview"
            src={asset(preview)}
            alt=""
            aria-hidden
            initial={{ opacity: 0, x: 40, y: '-50%' }}
            animate={{ opacity: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, x: 40, y: '-50%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
