import { useEffect, useRef } from 'react'

// Hand-rolled canvas starfield (no three.js). Stars are drawn from a pre-rendered
// glowing 4-point sparkle sprite (shiny, not flat circles) so we get glow for
// free via drawImage instead of costly per-frame shadowBlur. Depth drives size,
// brightness, drift, scroll-parallax and mouse-tilt. Occasional meteors streak
// across with a fading tail. One rAF loop; static single frame for reduced motion.
const SPARKLE = 'M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z'

function makeStarSprite(rgb) {
  const S = 64
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  const cx = S / 2
  // soft glow halo
  const halo = g.createRadialGradient(cx, cx, 0, cx, cx, cx)
  halo.addColorStop(0, `rgba(${rgb},0.85)`)
  halo.addColorStop(0.22, `rgba(${rgb},0.26)`)
  halo.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = halo
  g.fillRect(0, 0, S, S)
  // bright sparkle core with diffraction-spike shape
  const scale = (S * 0.78) / 24
  g.save()
  g.translate(cx, cx)
  g.scale(scale, scale)
  g.translate(-12, -12)
  const core = g.createRadialGradient(12, 12, 0, 12, 12, 12)
  core.addColorStop(0, 'rgba(255,255,255,1)')
  core.addColorStop(0.45, `rgba(${rgb},0.95)`)
  core.addColorStop(1, `rgba(${rgb},0.15)`)
  g.fillStyle = core
  g.fill(new Path2D(SPARKLE))
  g.restore()
  return c
}

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const spriteCool = makeStarSprite('200,224,255')
    const spriteWarm = makeStarSprite('255,205,150')

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars = []
    let meteors = []

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(360, Math.max(130, Math.round((w * h) / 6200)))
      stars = Array.from({ length: count }, () => {
        const z = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.6 + z * 1.9,
          tw: Math.random() * Math.PI * 2,
          tws: 0.8 + Math.random() * 2.0, // twinkle speed (glittery)
          warm: Math.random() < 0.12,
        }
      })
    }

    let mxT = 0
    let myT = 0
    let mx = 0
    let my = 0
    const onMove = (e) => {
      mxT = (e.clientX / w - 0.5) * 2
      myT = (e.clientY / h - 0.5) * 2
    }

    const spawnMeteor = () => {
      const dir = Math.random() < 0.5 ? 1 : -1
      const speed = 120 + Math.random() * 100
      const ang = (20 + Math.random() * 26) * (Math.PI / 180)
      const vx = dir * speed * Math.cos(ang)
      const vy = speed * Math.sin(ang)
      meteors.push({
        // start near the top edge with room to cross the whole screen
        x: dir === 1 ? -0.05 * w + Math.random() * w * 0.45 : w * 1.05 - Math.random() * w * 0.45,
        y: -0.05 * h,
        vx,
        vy,
        len: 150 + Math.random() * 140,
        life: 0,
        // live long enough to travel ~1.15 screen heights -> crosses (almost) fully
        maxLife: (h * 1.15) / vy,
      })
    }

    const start = performance.now()
    let last = start
    let nextSpawn = 1.2 + Math.random() * 2
    let raf = 0
    const draw = (now) => {
      const t = (now - start) / 1000
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      mx += (mxT - mx) * 0.06
      my += (myT - my) * 0.06
      ctx.clearRect(0, 0, w, h)

      // stars
      for (const s of stars) {
        const depth = 0.2 + s.z * 0.8
        let y = s.y - (window.scrollY || 0) * depth * 0.15 - t * depth * 6
        y = ((y % h) + h) % h
        const x = s.x + mx * depth * 26
        const yy = y + my * depth * 26
        const tw = 0.5 + 0.5 * Math.sin(t * s.tws + s.tw)
        const alpha = (0.35 + s.z * 0.6) * (0.45 + 0.55 * tw)
        const sz = (2.4 + s.r * 3.2) * (0.8 + 0.35 * tw)
        ctx.globalAlpha = Math.min(1, alpha)
        ctx.drawImage(s.warm ? spriteWarm : spriteCool, x - sz / 2, yy - sz / 2, sz, sz)
      }
      ctx.globalAlpha = 1

      // meteors
      if (!reduce) {
        meteors = meteors.filter(
          (m) => m.life < m.maxLife && m.x > -80 && m.x < w + 80 && m.y < h + 80
        )
        if (t >= nextSpawn && meteors.length === 0) {
          spawnMeteor()
          nextSpawn = t + 2.6 + Math.random() * 4.5
        }
        for (const m of meteors) {
          m.life += dt
          m.x += m.vx * dt
          m.y += m.vy * dt
          const sp = Math.hypot(m.vx, m.vy) || 1
          const ux = m.vx / sp
          const uy = m.vy / sp
          const tx = m.x - ux * m.len
          const ty = m.y - uy * m.len
          const k = m.life / m.maxLife
          const fade = Math.max(0, Math.min(1, k / 0.1, (1 - k) / 0.15))
          const grad = ctx.createLinearGradient(m.x, m.y, tx, ty)
          grad.addColorStop(0, `rgba(225,238,255,${0.9 * fade})`)
          grad.addColorStop(1, 'rgba(225,238,255,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          ctx.globalAlpha = fade
          ctx.drawImage(spriteCool, m.x - 9, m.y - 9, 18, 18)
          ctx.globalAlpha = 1
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduce && !touch) window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas className="starfield" ref={canvasRef} aria-hidden />
}
