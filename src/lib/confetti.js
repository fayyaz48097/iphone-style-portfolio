import { randomBetween } from './math'

const DEFAULT_COLORS = ['#FF4FD8', '#7B4DFF', '#0A84FF', '#30D158', '#FFD60A', '#FFFFFF']
const GRAVITY = 0.45
const DRAG = 0.99
const MAX_LIFE = 170

/**
 * Small canvas confetti engine. Framework agnostic: give it a canvas, call burst().
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ colors?: string[] }} [options]
 */
export function createConfetti(canvas, { colors = DEFAULT_COLORS } = {}) {
  const ctx = canvas.getContext('2d')
  let particles = []
  let frame = 0

  function resize() {
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function clear() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }

  function tick() {
    clear()
    particles = particles.filter((p) => p.life < MAX_LIFE && p.y < window.innerHeight + 40)

    for (const p of particles) {
      p.vy += GRAVITY
      p.vx *= DRAG
      p.x += p.vx
      p.y += p.vy
      p.angle += p.spin
      p.life += 1

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    }

    frame = particles.length ? requestAnimationFrame(tick) : 0
    if (!frame) clear()
  }

  function burst(count = 80, origin = { x: window.innerWidth / 2, y: window.innerHeight * 0.55 }) {
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: origin.x,
        y: origin.y,
        vx: randomBetween(-8, 8),
        vy: -randomBetween(6, 22),
        size: randomBetween(4, 10),
        color: colors[i % colors.length],
        angle: randomBetween(0, 6),
        spin: randomBetween(-0.15, 0.15),
        life: 0,
      })
    }

    if (!frame) frame = requestAnimationFrame(tick)
  }

  function destroy() {
    cancelAnimationFrame(frame)
    frame = 0
    particles = []
    clear()
  }

  resize()

  return { burst, resize, destroy }
}
