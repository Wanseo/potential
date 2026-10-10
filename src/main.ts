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
const prefix = document.querySelector<HTMLSpanElement>('.brand-prefix')!
const logoContainer = document.querySelector<HTMLSpanElement>('.brand-logo')!
const logo = document.querySelector<HTMLImageElement>('.brand-image')!
const label = document.querySelector<HTMLSpanElement>('.brand-text')!
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let animation: Animation | undefined
let prefixAnimation: Animation | undefined
let introFinished = false

function playIntro() {
  if (reducedMotion.matches || introFinished) return

  animation?.cancel()
  prefixAnimation?.cancel()
  const bounds = brand.getBoundingClientRect()
  const logoBounds = logoContainer.getBoundingClientRect()
  const scale = Math.max(1, Math.min((window.innerWidth * 0.86) / logoBounds.width, 5))
  const x = (window.innerWidth - logoBounds.width * scale) / 2
    - bounds.left - (logoBounds.left - bounds.left) * scale
  const y = (window.innerHeight - logoBounds.height * scale) / 2
    - bounds.top - (logoBounds.top - bounds.top) * scale
  const centered = `translate(${x}px, ${y}px) scale(${scale})`
  const fadeDuration = 400
  const holdDuration = 1500
  const moveDuration = 700
  const duration = fadeDuration + holdDuration + moveDuration
  const prefixFadeDuration = 300
  // 문구 공간은 유지하고 투명도만 바꿔 로고 위치가 변하지 않게 합니다.
  prefix.style.opacity = '0'

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
    // 이동 효과를 제거해 최종 레이아웃에 고정한 뒤 문구만 표시합니다.
    animation?.cancel()
    prefix.style.opacity = '1'
    prefixAnimation = prefix.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: prefixFadeDuration, easing: 'ease-in-out' },
    )
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
  prefixAnimation?.cancel()
  prefix.style.opacity = '1'
  introFinished = true
})
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    animation?.cancel()
    prefixAnimation?.cancel()
    prefix.style.opacity = '1'
    introFinished = true
  }
})
