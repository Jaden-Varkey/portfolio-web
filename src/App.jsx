import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Cursor from './components/Cursor.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import PageIntro from './components/PageIntro.jsx'
import FloatingNav from './components/FloatingNav.jsx'

// Thin accent line at the very top of the viewport, filling left-to-right as
// the page scrolls.
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />
}

// Reset scroll to top on route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Block copying/right-click, on top of the CSS user-select:none.
function CopyGuard() {
  useEffect(() => {
    const block = (e) => e.preventDefault()
    document.addEventListener('copy', block)
    document.addEventListener('cut', block)
    document.addEventListener('contextmenu', block)
    return () => {
      document.removeEventListener('copy', block)
      document.removeEventListener('cut', block)
      document.removeEventListener('contextmenu', block)
    }
  }, [])
  return null
}

export default function App() {
  return (
    <>
      <CopyGuard />
      <ScrollProgress />
      <Cursor />
      <PageIntro />
      <FloatingNav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
      <CursorTrail />
    </>
  )
}
