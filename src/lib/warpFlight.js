// Carries the reader through a warp crossing instead of leaving them parked
// inside one.
//
// Each crossing is a couple of viewports of pinned star tunnel with nothing in
// it to read. Crossed in one motion it's the best thing on the page; stopped
// halfway it's a dead room with no exit sign, and the only way out is to guess
// which direction you came from. So: enter one with any momentum and this takes
// the wheel and flies the rest of the crossing.
//
// The flight starts at the speed the reader was already scrolling, so it reads
// as their own motion carrying on rather than the page grabbing them, then
// decelerates into the arrival. A hard flick crosses in about a second and a
// quarter, a gentle entry takes nearly three. It yields at once to
// a gesture the other way, an arrow key, or a touch, and a crossing that has
// been vetoed stays manual until they leave it.
//
// Gated to fine pointers. On touch the browser owns the scroll position during
// its own momentum and writing to it every frame only produces a fight.

// A crossing is meant to read as a journey. The floor is what a genuinely fast
// flick gets and is deliberately the quickest this can ever be; everything
// slower than that drifts, out to nearly three seconds for a gentle entry.
const MIN_MS = 1250
const MAX_MS = 3000
// Speed floor, px/ms. Someone who drifts in almost stopped still has to be
// carried across, and pacing that flight off their actual velocity alone would
// take the better part of ten seconds.
const FLOOR_V = 0.7
// px/ms. Below this nobody is really moving — a stray pixel from a bounce or a
// layout shift shouldn't launch a flight.
const TRIGGER_V = 0.08
// Wheel delta against the flight that counts as a veto rather than trackpad
// inertia still draining in the direction they were already going.
const OVERRIDE_DELTA = 10
const EDGE = 6 // slack at each end of a crossing, in px

const KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar',
])

const warps = new Set()

let bound = false
let lastY = 0
let lastT = 0
let velocity = 0 // px/ms, signed
let flight = null
let vetoed = null // crossing the reader overrode, until they leave it
let suspendUntil = 0

const nowMs = () => performance.now()
const clamp = (n, lo, hi) => (n < lo ? lo : n > hi ? hi : n)
// easeOutCubic — opens at three times its average speed, then bleeds to
// nothing. Quad matched a hand-off in two thirds the time, which made every
// crossing but the very fastest feel hurried; cubic spends that time on a
// longer, gentler arrival. The slope constant is the curve's opening
// derivative, so the two have to change together or the flight stops leaving
// the gate at the speed it was handed.
const ease = (t) => 1 - (1 - t) ** 3
const OPENING_SLOPE = 3

const eligible = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// `enter` is the scroll position where the crossing starts (progress 0) and
// `exit` where it finishes (progress 1); between them the pin holds the screen.
function span(el) {
  const r = el.getBoundingClientRect()
  const top = window.scrollY + r.top
  return { enter: top, exit: top + r.height - window.innerHeight }
}

const maxScroll = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

function fly(el, to) {
  const from = window.scrollY
  const distance = clamp(to, 0, maxScroll()) - from
  if (Math.abs(distance) < 24) return

  // The duration whose opening frame moves at the speed they arrived at: the
  // flight leaves the gate matching their scroll and decelerates into the
  // arrival, so it reads as their own momentum carrying on.
  const speed = Math.max(Math.abs(velocity), FLOOR_V)
  const duration = clamp((OPENING_SLOPE * Math.abs(distance)) / speed, MIN_MS, MAX_MS)

  const root = document.documentElement
  const prevBehavior = root.style.scrollBehavior
  // The stylesheet asks for smooth scrolling, which would animate every single
  // frame we write and turn the flight into a smear.
  root.style.scrollBehavior = 'auto'

  const start = nowMs()
  flight = { el, dir: Math.sign(distance), raf: 0, prevBehavior }

  const step = () => {
    if (!flight) return
    const t = Math.min(1, (nowMs() - start) / duration)
    window.scrollTo(0, Math.round(from + distance * ease(t)))
    if (t < 1) flight.raf = requestAnimationFrame(step)
    else land()
  }
  flight.raf = requestAnimationFrame(step)
  grabInputs()
}

function land() {
  if (!flight) return
  cancelAnimationFrame(flight.raf)
  document.documentElement.style.scrollBehavior = flight.prevBehavior
  flight = null
  releaseInputs()
}

// Stop here, and leave this crossing alone until they've left it.
function veto() {
  if (!flight) return
  vetoed = flight.el
  land()
}

function onWheel(e) {
  if (!flight) return
  const against = flight.dir > 0 ? e.deltaY < -OVERRIDE_DELTA : e.deltaY > OVERRIDE_DELTA
  if (against) {
    veto()
    return
  }
  // Same-direction wheel is inertia draining or someone leaning on it; either
  // way it would stack on top of the flight and overshoot the arrival.
  e.preventDefault()
}

const onKey = (e) => { if (KEYS.has(e.key)) veto() }
const onTouch = () => veto()

function grabInputs() {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouch, { passive: true })
}
function releaseInputs() {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('touchstart', onTouch)
}

function check() {
  if (flight || nowMs() < suspendUntil) return
  if (Math.abs(velocity) < TRIGGER_V) return

  const y = window.scrollY
  const vh = window.innerHeight
  for (const el of warps) {
    const { enter, exit } = span(el)
    // Nothing pinned to fly through — the reduced-motion stylesheet collapses
    // a crossing to exactly one viewport, which leaves no range at all.
    if (exit - enter < vh * 0.2) continue
    if (y <= enter + EDGE || y >= exit - EDGE) continue
    if (vetoed === el) return
    // Land on the far side with the next section at the top of the screen,
    // rather than at the last frame of the tunnel.
    fly(el, velocity > 0 ? exit + vh : enter - vh)
    return
  }
}

function onScroll() {
  const t = nowMs()
  const y = window.scrollY
  const dt = t - lastT
  if (dt > 0) {
    const dy = y - lastY
    // A jump is not momentum. Scroll restoration on reload, a hash landing, or
    // any one-shot scrollTo can drop the reader into the middle of a crossing,
    // and reading that as a flick would launch a flight they never asked for.
    if (Math.abs(dy) > 400) velocity = 0
    // Smoothed, but weighted to the newest sample: over-smoothing makes a
    // flick read as a crawl and every flight comes out the same length.
    else velocity = velocity * 0.45 + (dy / dt) * 0.55
  }
  lastY = y
  lastT = t

  if (vetoed) {
    const { enter, exit } = span(vetoed)
    if (y <= enter + EDGE || y >= exit - EDGE) vetoed = null
  }
  check()
}

function bind() {
  if (bound) return
  bound = true
  lastY = window.scrollY
  lastT = nowMs()
  window.addEventListener('scroll', onScroll, { passive: true })
}

function unbind() {
  if (!bound) return
  bound = false
  window.removeEventListener('scroll', onScroll)
  land()
}

export function registerWarp(el) {
  if (!el || !eligible()) return () => {}
  warps.add(el)
  bind()
  return () => {
    warps.delete(el)
    if (flight?.el === el) land()
    if (vetoed === el) vetoed = null
    if (!warps.size) unbind()
  }
}

// Nav jumps scroll straight through the crossings at speed. Without this the
// first one on the way would grab the jump and strand the reader inside it.
export function suspendWarpFlight(ms = 1800) {
  suspendUntil = nowMs() + ms
  land()
}
