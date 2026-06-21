import { profile } from '../data/content.js'
import LogoTile from './LogoTile.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span className="footer-name">{profile.name}</span>
        <nav className="footer-socials">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="social-link"
              aria-label={s.label}
            >
              <LogoTile icon={s.icon} label={s.label} className="social-tile sm" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
