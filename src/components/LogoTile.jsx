// A brand logo. Works for colored or monochrome SVGs (and raster PNG/WebP via
// the optional `file` override) over the dark background. Used by the tech
// marquee and the social rows.
import { asset } from '../lib/asset.js'

export default function LogoTile({ icon, file, label, className = '' }) {
  const src = asset(`logos/${file || `${icon}.svg`}`)
  return (
    <span className={`logo-tile ${className}`} title={label}>
      <img src={src} alt={label} loading="lazy" draggable="false" />
    </span>
  )
}
