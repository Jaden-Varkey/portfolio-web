import { motion } from 'motion/react'
import { experience } from '../data/content.js'

// Wide full-bleed bars rather than the bento mosaic the projects use: roles are
// read top-to-bottom as a timeline, so a grid would only fight the ordering.
// Company, title, then blurb — no dates; `present` gets a small pill instead.
export default function Experience() {
  return (
    <section className="section exp-section" id="experience">
      <div className="wrap exp-wrap">
        <div className="section-head">
          <p className="eyebrow">02 / Experience</p>
          <h2 className="section-title">Experience</h2>
        </div>
        <div className="exp-list">
          {experience.map((e, i) => (
            <motion.article
              key={e.company}
              className="exp-bar"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
            >
              <div className="exp-head">
                <h3 className="exp-company">{e.company}</h3>
                {e.present && <span className="exp-present">Present</span>}
              </div>
              <p className="exp-role">{e.role}</p>
              {e.blurb && <p className="exp-blurb">{e.blurb}</p>}
              {e.tags?.length > 0 && (
                <div className="exp-tags">
                  {e.tags.map((t) => <span key={t} className="exp-tag">{t}</span>)}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
