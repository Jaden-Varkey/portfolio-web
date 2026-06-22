import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Cursor from './components/Cursor.jsx'
import Spotlight from './components/Spotlight.jsx'
import PageIntro from './components/PageIntro.jsx'
import FloatingNav from './components/FloatingNav.jsx'

// Reset scroll to top on route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <Cursor />
      <PageIntro />
      <FloatingNav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
      <Spotlight />
    </>
  )
}
