import Background from '../components/Background.jsx'
import Hero from '../components/Hero.jsx'
import Projects from '../components/Projects.jsx'
import TechStack from '../components/TechStack.jsx'
import Footer from '../components/Footer.jsx'
import '../styles/home.css'

export default function Home() {
  return (
    <>
      <Background />
      <main>
        <Hero />
        <Projects />
        <TechStack />
        <Footer />
      </main>
    </>
  )
}
