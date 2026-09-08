import { useEffect } from 'react'
import Background from '../components/Background.jsx'
import Hero from '../components/Hero.jsx'
import Projects from '../components/Projects.jsx'
import Experience from '../components/Experience.jsx'
import WarpTransition from '../components/WarpTransition.jsx'
import TechStack from '../components/TechStack.jsx'
import Footer from '../components/Footer.jsx'
import { trackSections } from '../lib/telemetry.js'
import '../styles/home.css'

const SECTIONS = ['projects', 'experience', 'stack']

export default function Home() {
  // How far down the page people actually get.
  useEffect(() => trackSections(SECTIONS), [])

  return (
    <>
      <Background />
      <main>
        <Hero />
        <WarpTransition
          className="warp-short"
          kicker="Leaving orbit"
          title="Things I've"
          accent="built"
          intensity={0.7}
        />
        <Projects />
        <WarpTransition
          kicker="Next"
          title="Where I've"
          accent="shipped"
        />
        <Experience />
        <WarpTransition
          className="warp-short"
          kicker="Finally"
          title="What I build"
          accent="with"
          intensity={0.7}
        />
        <TechStack />
        <Footer />
      </main>
    </>
  )
}
