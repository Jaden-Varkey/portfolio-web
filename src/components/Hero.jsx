import { motion } from 'framer-motion'
import { profile } from '../data/content.js'
import LogoTile from './LogoTile.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <header className="hero">
      <motion.div
        className="wrap hero-inner"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className="hero-hi" variants={item}>Hi, I'm</motion.p>
        <motion.h1 className="hero-name gradient-text" variants={item}>{profile.name}</motion.h1>
        <motion.p className="hero-intro" variants={item}>{profile.intro}</motion.p>
        <motion.nav className="hero-socials" variants={item}>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="social-link"
              aria-label={s.label}
            >
              <LogoTile icon={s.icon} label={s.label} className="social-tile" />
            </a>
          ))}
        </motion.nav>
      </motion.div>
    </header>
  )
}
