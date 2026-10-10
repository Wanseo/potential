import './style.css'
import { products, selectProducts } from './products.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="Potential 홈">
      <span class="brand-logo">
        <span class="brand-text" aria-hidden="true">POTENTIAL</span>
        <img class="brand-image" alt="POTENTIAL" hidden />
      </span>
    </a>
    <nav class="site-nav" aria-label="메인 메뉴">
      <div class="shop-menu">
        <a href="#shop">Shop</a>
        <ul class="shop-dropdown" aria-label="Shop 상품 분류">
          <li><a href="#shop">ALL</a></li>
          <li><a href="#shop/laptop-stickers">Laptop Stickers</a></li>
          <li><a href="#shop/calendar">Calendar</a></li>
          <li><a href="#shop/griptok">GripTok</a></li>
          <li><a href="#shop/memo-pad">Memo Pad</a></li>
          <li><a href="#shop/eco-bag">Eco Bag</a></li>
        </ul>
      </div>
      <a href="#about">About</a>
      <a href="#archive">Archive</a>
      <a href="https://www.instagram.com/youaremypotential/" target="_blank" rel="noopener noreferrer">Instagram</a>
    </nav>
  </header>
  <main class="home-content" aria-label="POTENTIAL 홈">
    <img class="home-image" src="${import.meta.env.BASE_URL}main-image-cutout.png" alt="파란색과 분홍색 POTENTIAL 패키지 상자" fetchpriority="high" />
  </main>
  <main class="page-content" tabindex="-1" hidden></main>
  <footer class="site-footer">
    <span>© 2026 POTENTIAL. Site by <a href="https://www.instagram.com/wsjoy_/" target="_blank" rel="noopener noreferrer">@wsjoy_</a></span>
    <span class="site-location">Seoul, Korea</span>
  </footer>
  <img class="rotating-logo" src="${import.meta.env.BASE_URL}potential-circle.png" alt="" aria-hidden="true" width="112" height="112" />
`

const brand = document.querySelector<HTMLAnchorElement>('.brand')!
const header = document.querySelector<HTMLElement>('.site-header')!
const logoContainer = document.querySelector<HTMLSpanElement>('.brand-logo')!
const logo = document.querySelector<HTMLImageElement>('.brand-image')!
const homeImage = document.querySelector<HTMLImageElement>('.home-image')!
const label = document.querySelector<HTMLSpanElement>('.brand-text')!
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let animation: Animation | undefined
let introFinished = false

const pages: Record<string, string> = {
  shop: 'Shop',
  'shop/laptop-stickers': 'Laptop Stickers',
  'shop/calendar': 'Calendar',
  'shop/griptok': 'GripTok',
  'shop/memo-pad': 'Memo Pad',
  'shop/eco-bag': 'Eco Bag',
  about: 'About',
  archive: 'Archive',
}
const content = document.querySelector<HTMLElement>('.page-content')!
const home = document.querySelector<HTMLElement>('.home-content')!
const menuLinks = document.querySelectorAll<HTMLAnchorElement>('.site-nav a')

function renderProducts(page: string) {
  content.replaceChildren()
  if (page !== 'shop' && !page.startsWith('shop/')) return

  const visibleProducts = selectProducts(products, page.split('/')[1])
  if (!visibleProducts.length) {
    const empty = document.createElement('p')
    empty.className = 'products-empty'
    empty.textContent = '아직 등록된 상품이 없습니다.'
    content.append(empty)
    return
  }

  const grid = document.createElement('ul')
  grid.className = 'product-grid'
  visibleProducts.forEach((product) => {
    const card = document.createElement('li')
    card.className = 'product-card'
    const image = document.createElement('img')
    image.src = `${import.meta.env.BASE_URL}${product.image.replace(/^\/+/, '')}`
    image.alt = product.name
    image.loading = 'lazy'
    const name = document.createElement('p')
    name.className = 'product-name'
    name.textContent = product.name
    card.append(image, name)
    if (product.price !== undefined) {
      const price = document.createElement('p')
      price.className = 'product-price'
      price.textContent = new Intl.NumberFormat('ko-KR', {
        style: 'currency', currency: 'KRW', maximumFractionDigits: 0,
      }).format(product.price)
      card.append(price)
    }
    grid.append(card)
  })
  content.append(grid)
}

function showPage(moveFocus = false) {
  const page = window.location.hash.slice(1)
  const title = Object.hasOwn(pages, page) ? pages[page] : undefined
  header.classList.toggle('has-page', Boolean(title))
  content.hidden = !title
  home.hidden = Boolean(title)
  renderProducts(title ? page : '')
  if (title) content.setAttribute('aria-label', title)
  else content.removeAttribute('aria-label')
  document.title = title ? `${title} | POTENTIAL` : 'POTENTIAL'
  menuLinks.forEach((link) => {
    if (title && link.hash === `#${page}`) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
  if (title) {
    animation?.cancel()
    introFinished = true
    header.classList.add('is-settled')
    if (moveFocus) content.focus({ preventScroll: true })
  }
}

window.addEventListener('hashchange', () => showPage(true))
window.addEventListener('popstate', () => showPage(true))
brand.addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  event.preventDefault()
  animation?.cancel()
  introFinished = true
  header.classList.add('is-settled')
  if (window.location.hash) {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
  }
  showPage()
  window.scrollTo({ top: 0, behavior: 'instant' })
})
showPage()

function playIntro() {
  if (reducedMotion.matches || introFinished) {
    header.classList.add('is-settled')
    return
  }

  animation?.cancel()
  const bounds = brand.getBoundingClientRect()
  const logoBounds = logoContainer.getBoundingClientRect()
  const scale = Math.max(1, Math.min((window.innerWidth * 0.86) / logoBounds.width, 5))
  const x = (window.innerWidth - logoBounds.width * scale) / 2
    - bounds.left - (logoBounds.left - bounds.left) * scale
  const y = (window.innerHeight - logoBounds.height * scale) / 2
    - bounds.top - (logoBounds.top - bounds.top) * scale
  const centered = `translate(${x}px, ${y}px) scale(${scale})`
  const fadeDuration = 400
  const holdDuration = 800
  const moveDuration = 400
  const duration = fadeDuration + holdDuration + moveDuration

  animation = brand.animate(
    [
      { transform: centered, opacity: 0, offset: 0 },
      { transform: centered, opacity: 1, offset: fadeDuration / duration },
      {
        transform: centered,
        opacity: 1,
        offset: (fadeDuration + holdDuration) / duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 1 },
    ],
    { duration, easing: 'linear' },
  )
  animation.onfinish = () => {
    introFinished = true
    // 이동 효과를 제거해 최종 레이아웃에 고정합니다.
    animation?.cancel()
    header.classList.add('is-settled')
  }
}

// 원본 이미지를 public/potential-logo.png에 넣으면 자동으로 사용합니다.
logo.onload = async () => {
  // 박스도 미리 준비해 로고 도착 시 메뉴와 같은 프레임에 표시합니다.
  await homeImage.decode().catch(() => undefined)
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
  header.classList.add('is-settled')
})
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    animation?.cancel()
    introFinished = true
    header.classList.add('is-settled')
  }
})
