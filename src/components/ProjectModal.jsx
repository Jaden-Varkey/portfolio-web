import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projectDetails } from '../data/content.js'
import ProjectDetailContent from './ProjectDetailContent.jsx'
import '../styles/detail.css'

// In-page project case study. Opens as an overlay so the user never leaves the
// home page. Closes on backdrop click, the × button, or Escape; locks the page
// scroll while open.
export default function ProjectModal({ slug, onClose }) {
  const p = slug ? projectDetails[slug] : null

  useEffect(() => {
    if (!p) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden' // root is the scroller (carries scroll-snap)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prev
    }
  }, [p, onClose])

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="pm-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="pm-launch"
            role="dialog"
            aria-modal="true"
            aria-label={p.name}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="pm-exhaust" aria-hidden />
            <span className="pm-skirt" aria-hidden />
            <div className="pm-panel">
              <span className="pm-frame" aria-hidden />
              <div className="pm-nose" aria-hidden>
                <span className="pm-porthole" />
              </div>
              <div className="pm-head">
                <span className="pm-lights" aria-hidden><i /><i /><i /></span>
                <span className="pm-label">◇ Mission Dossier</span>
                <button className="pm-close" onClick={onClose} aria-label="Close">×</button>
              </div>
              <div className="pm-body">
                <ProjectDetailContent p={p} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
