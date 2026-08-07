import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Cursor from './components/Cursor.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import PageIntro from './components/PageIntro.jsx'
import FloatingNav from './components/FloatingNav.jsx'

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
