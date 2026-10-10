import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="you are my Potential 홈">
      <span class="brand-prefix">you are my</span>
      <span class="brand-logo">
        <span class="brand-text" aria-hidden="true">POTENTIAL</span>
        <img class="brand-image" alt="POTENTIAL" hidden />
      </span>
    </a>
  </header>
`

const brand = document.querySelector<HTMLAnchorElement>('.brand')!
const logo = document.querySelector<HTMLImageElement>('.brand-image')!
const label = document.querySelector<HTMLSpanElement>('.brand-text')!
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let animation: Animation | undefined
let introFinished = false

function playIntro() {
  if (reducedMotion.matches || introFinished) return

  animation?.cancel()
  const bounds = brand.getBoundingClientRect()
  const scale = Math.max(1, Math.min((window.innerWidth * 0.86) / bounds.width, 5))
  const x = (window.innerWidth - bounds.width * scale) / 2 - bounds.left
  const y = (window.innerHeight - bounds.height * scale) / 2 - bounds.top
  const centered = `translate(${x}px, ${y}px) scale(${scale})`
  const fadeDuration = 400
  const holdDuration = 2000
  const moveDuration = 1200
  const duration = fadeDuration + holdDuration + moveDuration

  animation = brand.animate(
    [
      { transform: centered, opacity: 0, offset: 0 },
      { transform: centered, opacity: 1, offset: fadeDuration / duration },
      {
        transform: centered,
        opacity: 1,
        offset: (fadeDuration + holdDuration) / duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 1 },
    ],
    { duration, easing: 'linear' },
  )
  animation.onfinish = () => {
    introFinished = true
  }
}

// 원본 이미지를 public/potential-logo.png에 넣으면 자동으로 사용합니다.
logo.onload = () => {
  label.hidden = true
  logo.hidden = false
  brand.classList.add('is-ready')
  playIntro()
}
logo.onerror = () => {
  logo.hidden = true
  label.hidden = false
  brand.classList.add('is-ready')
  playIntro()
}
logo.src = `${import.meta.env.BASE_URL}potential-logo.png`

window.addEventListener('resize', () => {
  animation?.cancel()
  introFinished = true
})
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    animation?.cancel()
    introFinished = true
  }
})
