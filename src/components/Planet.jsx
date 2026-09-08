import { useEffect, useRef } from 'react'

// The planet limb that the whole site sits above, drawn as a real sphere in a
// WebGL fragment shader instead of the static photo it replaces.
//
// A photo can only ever be panned and cropped. Solving for the sphere per pixel
// means the surface can actually rotate, the terminator moves with it, the
// atmosphere is a true fresnel rim, and scroll can pull the camera away — which
// is what lets the warp sections read as a continuation of the same journey
// rather than a cut to somewhere else.
//
// One full-screen triangle, one pass, no geometry and no three.js.

const VERT = `#version 300 es
void main() {
  // Oversized triangle covering the clip cube; cheaper than a quad.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2      uRes;
uniform float     uTime;
uniform float     uScroll;   // 0 at the top of the page, 1 at the bottom
uniform float     uDepart;   // 0 normally, 1 once a warp has taken over
uniform sampler2D uRock;     // photographed asteroid, alpha-cut
uniform float     uHasRock;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  // Aspect-corrected, y-up, origin at screen centre.
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Camera pulls back and the planet sinks as the page scrolls, so descending
  // the page reads as rising away from the surface.
  float depart = uDepart;
  float R = mix(1.62, 1.12, uScroll) * (1.0 - 0.55 * depart);
  vec2  C = vec2(0.0, mix(-1.86, -2.52, uScroll) - 1.4 * depart);

  vec2  d = uv - C;
  float r = length(d);

  // Antialias the limb across one pixel of the radius field; the canvas renders
  // below device resolution and the limb is a near-horizontal arc.
  float px = max(fwidth(r), 1e-5);
  float disc = 1.0 - smoothstep(R - px, R + px, r);

  vec3  col = vec3(0.0);
  float alpha = 0.0;

  vec3 sun = normalize(vec3(0.55, 0.62, 0.56));

  // ---- atmosphere -------------------------------------------------------
  // Outside the limb only, brightest right at the edge. It carries alpha as
  // well as colour so it veils the stars behind it instead of being drawn
  // over them at full strength.
  float outside = 1.0 - disc;
  float glow = smoothstep(R + 0.34, R, r) * outside;
  float band = pow(smoothstep(R + 0.10, R, r), 3.0) * outside;
  vec3  atmoCol = mix(vec3(0.05, 0.32, 0.62), vec3(0.42, 0.76, 0.95), band);
  float atmoA = clamp(glow * 0.42 + band * 0.85, 0.0, 1.0);
  col += atmoCol * atmoA;
  alpha = max(alpha, atmoA);

  // ---- surface ----------------------------------------------------------
  if (disc > 0.0) {
    float rc = min(r, R);
    float z = sqrt(max(0.0, R * R - rc * rc));
    vec3  n = normalize(vec3(d, max(z, 1e-4)));

    // Slow axial spin; the surface moves, the silhouette does not.
    float spin = uTime * 0.017;
    float lon = atan(n.x, n.z) + spin;
    float lat = asin(clamp(n.y, -1.0, 1.0));

    vec2  sp = vec2(lon * 1.55, lat * 2.6);
    float land = smoothstep(0.50, 0.62, fbm(sp * 2.1 + 11.0));

    vec3 ocean  = vec3(0.016, 0.055, 0.115);
    vec3 ground = vec3(0.055, 0.085, 0.070);
    vec3 surf = mix(ocean, ground, land);

    // Sun is high and to the right (declared above); the terminator falls
    // across the lower left.
    float day = smoothstep(-0.12, 0.42, dot(n, sun));

    // Night side: clustered city lights in the site's amber, on land only.
    float cityMask = smoothstep(0.55, 0.85, fbm(sp * 9.0 + 3.0)) * land;
    vec3  city = vec3(1.0, 0.72, 0.28) * (1.0 - day) * cityMask * 0.85;

    // Thin cloud veil, drifting slightly faster than the ground.
    float cloud = smoothstep(0.54, 0.78, fbm(sp * 3.2 + vec2(uTime * 0.006, 0.0)));
    surf = mix(surf, vec3(0.62, 0.68, 0.76), cloud * 0.30 * day);

    vec3 lit = surf * (0.06 + day * 1.05) + city;

    // Rim light where the atmosphere wraps the visible edge.
    float rim = pow(1.0 - clamp(z / R, 0.0, 1.0), 3.2);
    lit += vec3(0.30, 0.60, 0.92) * rim * (0.22 + day * 0.75);

    col = mix(col, lit, disc);
    alpha = max(alpha, disc);
  }

  // Fade the planet out once a warp owns the screen.
  float leave = 1.0 - depart * 0.9;
  col *= leave;
  alpha *= leave;

  // ---- asteroids --------------------------------------------------------
  // A photographed rock rather than procedural geometry: four passes of the
  // same texture at different sizes, rotations and drift rates. Deliberately
  // NOT faded by uDepart — past the first crossing the planet is gone for good
  // and these are what keep the rest of the page from being empty black.
  if (uHasRock > 0.5) {
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float hx = hash(vec2(fi, 7.3));
      float hy = hash(vec2(fi, 19.1));
      float hs = hash(vec2(fi, 31.7));
      float hp = hash(vec2(fi, 5.9));

      // Kept modest: these are set dressing, not subjects.
      float rad = mix(0.034, 0.082, hs * hs);
      float y0  = 0.85 + hy * 2.05;
      // Rate ties to start height so each rock completes one crossing per page.
      float par = y0 + 1.15 + hp * 0.7;
      // Out at the sides, where the opaque content column isn't.
      float side = hash(vec2(fi, 43.1)) < 0.5 ? -1.0 : 1.0;
      vec2  c = vec2(side * mix(0.60, 0.84, hx), y0 - uScroll * par);

      // Uniform across fragments, so skipping here is safe for fwidth().
      if (abs(c.y) > 0.55 + rad) continue;

      // Slow tumble, opposite directions either side.
      vec2 q = (uv - c) / rad;
      q = rot(hp * 6.283 + uTime * mix(0.010, 0.035, hs) * side) * q;
      vec2 t = q * 0.5 + 0.5;
      if (t.x < 0.0 || t.x > 1.0 || t.y < 0.0 || t.y > 1.0) continue;

      // The render is lit from the upper left; mirroring puts its highlight on
      // the same side as the planet's sun.
      vec4 rock = texture(uRock, vec2(1.0 - t.x, 1.0 - t.y));
      if (rock.a < 0.01) continue;

      // Cooled slightly so it belongs to this scene rather than sitting on top
      // as a bright cutout, but not so far that it disappears into the black.
      float k = mix(0.80, 1.0, hs);
      vec3  tint = vec3(0.82, 0.84, 0.92) * mix(0.80, 1.05, hs);
      // The texture is uploaded premultiplied, so this is a straight over
      // composite: mix() would apply the alpha a second time and crush it.
      vec3  rgbp = rock.rgb * tint * k;
      float a2 = rock.a * k;
      col = col * (1.0 - a2) + rgbp;
      alpha = alpha * (1.0 - a2) + a2;
    }
  }

  // Premultiplied: the canvas composites over the starfield behind it.
  outColor = vec4(col, alpha);
}`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('planet shader:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function Planet({ scrollRef, departRef, onReady, onLost }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    })
    if (!gl) return // caller keeps the still image as the fallback

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('planet link:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)
    gl.clearColor(0, 0, 0, 0)
    onReady?.()

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uScroll = gl.getUniformLocation(prog, 'uScroll')
    const uDepart = gl.getUniformLocation(prog, 'uDepart')
    const uRock = gl.getUniformLocation(prog, 'uRock')
    const uHasRock = gl.getUniformLocation(prog, 'uHasRock')
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    // The asteroid arrives asynchronously; until then uHasRock keeps the loop
    // switched off rather than sampling an empty texture.
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(uRock, 0)
    gl.uniform1f(uHasRock, 0)
    let hasRock = false

    const img = new Image()
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      // The PNG is straight alpha; premultiply on upload so the edges composite
      // without a dark fringe.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.generateMipmap(gl.TEXTURE_2D)
      hasRock = true
    }
    img.src = `${import.meta.env.BASE_URL}asteroid.png`

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Half-res is plenty: the image is all smooth gradients, and it keeps the
    // fragment cost off the budget on integrated GPUs.
    const scale = reduced ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.6

    let w = 0
    let h = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width * scale))
      h = Math.max(1, Math.round(r.height * scale))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let hidden = false
    const onVis = () => { hidden = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const t0 = performance.now()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (hidden) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - t0) / 1000)
      gl.uniform1f(uScroll, scrollRef?.current ?? 0)
      gl.uniform1f(uDepart, departRef?.current ?? 0)
      gl.uniform1f(uHasRock, hasRock ? 1 : 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    const lost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); onLost?.() }
    canvas.addEventListener('webglcontextlost', lost)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', lost)
    }
  }, [scrollRef, departRef, onReady, onLost])

  return <canvas className="planet-canvas" ref={canvasRef} aria-hidden />
}
