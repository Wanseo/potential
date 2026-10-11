import './style.css'
import { products, selectProducts } from './products.ts'
import { renderProductDetail } from './product-detail.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="Potential 홈">
      <span class="brand-logo">
        <span class="brand-text" aria-hidden="true">POTENTIAL</span>
        <img class="brand-image" alt="POTENTIAL" hidden />
      </span>
    </a>
    <div class="header-menu-row">
    <nav class="site-nav" aria-label="메인 메뉴">
      <details class="shop-menu">
        <summary>Shop</summary>
        <ul class="shop-dropdown" aria-label="Shop 상품 분류">
          <li><a href="#shop">ALL</a></li>
          <li><a href="#shop/laptop-stickers">Laptop Sticker</a></li>
          <li><a href="#shop/calendar">Calendar</a></li>
          <li><a href="#shop/griptok">Phone Grip</a></li>
          <li><a href="#shop/phone-case">Phone Case</a></li>
          <li><a href="#shop/memo-pad">Memo Pad</a></li>
          <li><a href="#shop/eco-bag">Eco Bag</a></li>
        </ul>
      </details>
      <a href="#about">About</a>
      <a href="#archive">Archive</a>
      <details class="shop-menu contact-menu">
        <summary>Contact</summary>
        <ul class="shop-dropdown contact-dropdown" aria-label="Contact 연락처">
          <li><a href="https://www.instagram.com/youaremypotential/" target="_blank" rel="noopener noreferrer">@youaremypotential</a></li>
        </ul>
      </details>
    </nav>
    <div class="header-actions">
      <span class="search-icon" role="img" aria-label="검색">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="17" cy="17" r="13" />
          <path d="m27 27 10 10" />
        </svg>
      </span>
      <span class="login-label">LogIn</span>
      <span class="cart-label">Cart</span>
    </div>
    </div>
  </header>
  <p class="home-quote">He said to me, “You are my potential”<br />
    So I started making all sorts of things.<br />
    Maybe I take after my dad<br />
    I love making beautiful things.<br />
    I hope the things I make bring you joy.</p>
  <div class="page-breadcrumb" hidden></div>
  <main class="home-content" aria-label="POTENTIAL 홈">
    <img class="home-image" src="${import.meta.env.BASE_URL}main-image-08.png" alt="윗면에 흰색 브랜드 문구가 적힌 파란색과 보라색 POTENTIAL 패키지 상자" fetchpriority="high" />
  </main>
  <main class="page-content" tabindex="-1" hidden></main>
  <footer class="site-footer">
    <span>© 2026 POTENTIAL. Site by <a href="https://www.instagram.com/wsjoy_/" target="_blank" rel="noopener noreferrer">@wsjoy_</a></span>
    <span class="site-location">Seoul, Korea</span>
  </footer>
  <img class="rotating-logo" src="${import.meta.env.BASE_URL}potential-circle-03-cutout.png" alt="" aria-hidden="true" width="112" height="112" />
`

const brand = document.querySelector<HTMLAnchorElement>('.brand')!
const header = document.querySelector<HTMLElement>('.site-header')!
const breadcrumb = document.querySelector<HTMLDivElement>('.page-breadcrumb')!
const headerActions = document.querySelector<HTMLDivElement>('.header-actions')!
const logoContainer = document.querySelector<HTMLSpanElement>('.brand-logo')!
const logo = document.querySelector<HTMLImageElement>('.brand-image')!
const homeImage = document.querySelector<HTMLImageElement>('.home-image')!
const label = document.querySelector<HTMLSpanElement>('.brand-text')!
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let animation: Animation | undefined
let introFinished = false

const pages: Record<string, string> = {
  shop: 'Shop',
  'shop/laptop-stickers': 'Laptop Sticker',
  'shop/calendar': 'Calendar',
  'shop/griptok': 'Phone Grip',
  'shop/phone-case': 'Phone Case',
  'shop/memo-pad': 'Memo Pad',
  'shop/eco-bag': 'Eco Bag',
  about: 'About',
  archive: 'Archive',
}
const content = document.querySelector<HTMLElement>('.page-content')!
const home = document.querySelector<HTMLElement>('.home-content')!
const menuLinks = document.querySelectorAll<HTMLAnchorElement>('.site-nav a')
const homeShopMenu = document.querySelector<HTMLDetailsElement>('.site-nav .shop-menu')!
let homeShopPinned = false
homeShopMenu.querySelector('summary')!.addEventListener('click', (event) => {
  event.preventDefault()
  homeShopPinned = !homeShopPinned
  homeShopMenu.open = homeShopPinned
})
homeShopMenu.addEventListener('pointerenter', (event) => {
  if (event.pointerType !== 'touch' && !header.classList.contains('is-content-page')) {
    homeShopMenu.open = true
  }
})
homeShopMenu.addEventListener('pointerleave', (event) => {
  if (event.pointerType !== 'touch' && !homeShopPinned) homeShopMenu.open = false
})
document.querySelector('.site-nav')!.addEventListener('click', (event) => {
  if (!(event.target instanceof Node)) return
  document.querySelectorAll<HTMLDetailsElement>('.site-nav > details').forEach((dropdown) => {
    if (!dropdown.contains(event.target as Node)) dropdown.open = false
  })
  if (!homeShopMenu.contains(event.target)) {
    homeShopPinned = false
    homeShopMenu.open = false
  }
})
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Node)) return
  document.querySelectorAll<HTMLDetailsElement>('.site-nav > details').forEach((dropdown) => {
    if (!dropdown.contains(event.target as Node)) {
      dropdown.open = false
      if (dropdown === homeShopMenu) homeShopPinned = false
    }
  })
})

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
    card.dataset.productId = product.id
    const link = document.createElement('a')
    link.className = 'product-link'
    link.href = `#product/${product.id}`
    const image = document.createElement('img')
    image.src = `${import.meta.env.BASE_URL}${product.image.replace(/^\/+/, '')}`
    image.alt = product.name
    image.loading = 'lazy'
    const name = document.createElement('p')
    name.className = 'product-name'
    name.textContent = product.name
    link.append(image, name)
    if (product.price !== undefined) {
      const price = document.createElement('p')
      price.className = 'product-price'
      price.textContent = new Intl.NumberFormat('ko-KR', {
        style: 'currency', currency: 'KRW', maximumFractionDigits: 0,
      }).format(product.price)
      if (product.category === 'laptop-stickers') {
        const status = document.createElement('span')
        status.className = 'product-status'
        status.textContent = '준비 중'
        price.replaceChildren()
        price.append(status)
      }
      link.append(price)
    }
    card.append(link)
    grid.append(card)
  })
  content.append(grid)
}

function showPage(moveFocus = false) {
  const page = window.location.hash.slice(1)
  const product = page.startsWith('product/')
    ? products.find((item) => item.id === page.slice('product/'.length)) : undefined
  const title = product?.name ?? (Object.hasOwn(pages, page) ? pages[page] : undefined)
  homeShopPinned = false
  homeShopMenu.open = false
  header.classList.toggle('is-content-page', Boolean(title))
  header.classList.toggle('is-shop-page', Boolean(title && (page === 'shop' || page.startsWith('shop/') || product)))
  breadcrumb.hidden = !title
  breadcrumb.replaceChildren()
  if (title) {
    const menu = document.createElement('details')
    menu.className = 'breadcrumb-menu'
    const toggle = document.createElement('summary')
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 5h18M3 12h18M3 19h18" /></svg>'
    toggle.setAttribute('aria-label', '전체 메뉴 열기')
    const navigation = document.createElement('nav')
    navigation.className = 'breadcrumb-dropdown'
    navigation.setAttribute('aria-label', '전체 메뉴')
    const shopGroup = document.createElement('details')
    shopGroup.className = 'breadcrumb-shop-group'
    const shopToggle = document.createElement('summary')
    shopToggle.setAttribute('aria-label', 'Shop 상품 분류 펼치기')
    shopToggle.textContent = 'Shop'
    const shopArrow = document.createElement('span')
    shopArrow.className = 'shop-short-arrow'
    shopArrow.setAttribute('aria-hidden', 'true')
    shopArrow.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M8 5v6M4 8l4 4 4-4" /></svg>'
    shopToggle.append(shopArrow)
    const categories = document.createElement('nav')
    categories.className = 'breadcrumb-categories'
    categories.setAttribute('aria-label', 'Shop 상품 분류')
    Object.entries(pages).filter(([route]) => route === 'shop' || route.startsWith('shop/')).forEach(([route, name]) => {
      const link = document.createElement('a')
      link.href = `#${route}`
      link.textContent = route === 'shop' ? 'ALL' : name
      if (route === page) link.setAttribute('aria-current', 'page')
      link.addEventListener('click', () => { menu.open = false })
      categories.append(link)
    })
    shopGroup.append(shopToggle, categories)
    navigation.append(shopGroup)
    for (const route of ['about', 'archive'] as const) {
      const link = document.createElement('a')
      link.href = `#${route}`
      link.textContent = pages[route]
      link.addEventListener('click', () => { menu.open = false })
      navigation.append(link)
    }
    const contactGroup = document.createElement('details')
    contactGroup.className = 'breadcrumb-shop-group'
    const contactToggle = document.createElement('summary')
    contactToggle.textContent = 'Contact'
    const contactLinks = document.createElement('div')
    contactLinks.className = 'breadcrumb-categories contact-links'
    contactLinks.innerHTML = '<a href="https://www.instagram.com/youaremypotential/" target="_blank" rel="noopener noreferrer">@youaremypotential</a>'
    contactGroup.append(contactToggle, contactLinks)
    navigation.append(contactGroup)
    menu.append(toggle, navigation)
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.open = false
        toggle.focus()
      }
    })
    breadcrumb.append(menu)
    const breadcrumbPath = document.createElement('span')
    breadcrumbPath.className = 'breadcrumb-path'
    const segments = page === 'shop' ? ['Shop', 'ALL']
      : product ? ['Shop', pages[`shop/${product.category}`] ?? product.category]
      : page.startsWith('shop/') ? ['Shop', title]
      : [title]
    segments.forEach((segment, index) => {
      if (index) breadcrumbPath.append(' / ')
      if (index === 0 && segments.length > 1) {
        const link = document.createElement('a')
        link.href = '#shop'
        link.textContent = segment
        breadcrumbPath.append(link)
      } else {
        const current = document.createElement('span')
        current.textContent = segment
        current.setAttribute('aria-current', 'page')
        breadcrumbPath.append(current)
      }
    })
    breadcrumb.append(breadcrumbPath)
  }
  content.hidden = !title
  header.append(headerActions)
  home.hidden = Boolean(title)
  document.querySelector<HTMLElement>('.home-quote')!.hidden = Boolean(title)
  renderProducts(title ? page : '')
  if (product) renderProductDetail(content, product)
  if (title) content.setAttribute('aria-label', title)
  else content.removeAttribute('aria-label')
  document.title = title ? `${title} | POTENTIAL` : 'POTENTIAL'
  menuLinks.forEach((link) => {
    if (title && (link.hash === `#${page}` || (product && link.hash === '#shop'))) {
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
  const scale = Math.max(1, Math.min((window.innerWidth * 0.5) / logoBounds.width, 2.8))
  const x = (window.innerWidth - logoBounds.width * scale) / 2
    - bounds.left - (logoBounds.left - bounds.left) * scale
  const y = (window.innerHeight - logoBounds.height * scale) / 2
    - bounds.top - (logoBounds.top - bounds.top) * scale
  const centered = `translate(${x}px, ${y}px) scale(${scale})`
  const fadeDuration = 250
  const holdDuration = 500
  const moveDuration = 300
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

// 새 가로형 로고를 모든 화면의 브랜드 이미지에 사용합니다.
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
logo.src = `${import.meta.env.BASE_URL}potential-logo-02.png`

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
