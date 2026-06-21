import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

const items = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
]

// Mini top dashboard — smooth-scrolls to each section. Works from detail pages
// too (navigates home first, then scrolls).
export default function FloatingNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const go = (id) => {
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollTo(id), 80)
    } else {
      scrollTo(id)
    }
  }

  const home = () => {
    if (pathname !== '/') navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="floating-nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="nav-mark" onClick={home} aria-label="Jaden Varkey — home">
        <span className="nav-mark-inner">
          <span className="mono-j gradient-text">J</span>
          <span className="mono-v gradient-text">V</span>
        </span>
      </button>
      <div className="nav-links">
        {items.map((it) => (
          <button key={it.id} className="nav-link" onClick={() => go(it.id)}>
            {it.label}
          </button>
        ))}
      </div>
    </motion.nav>
  )
}
