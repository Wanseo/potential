import type { Product } from './products.ts'

export function renderProductDetail(container: HTMLElement, product: Product) {
  container.innerHTML = `
    <a class="product-back" href="#shop/laptop-stickers">← Back to Shop</a>
    <article class="product-detail">
      <div class="detail-gallery"><img alt="" /></div>
      <div class="detail-info">
        <h1></h1>
        <p class="detail-price"></p>
        <p class="detail-description">POTENTIAL 로고 스티커</p>
        <div class="detail-option"><span>Color</span><span>Yellow / Black</span></div>
        <div class="detail-option">
          <span>Quantity</span>
          <div class="quantity-control">
            <button type="button" class="quantity-minus" aria-label="수량 줄이기">−</button>
            <input type="number" min="1" max="99" value="1" aria-label="상품 수량" />
            <button type="button" class="quantity-plus" aria-label="수량 늘리기">+</button>
          </div>
        </div>
        <button class="purchase-button" type="button" disabled>구매 준비 중</button>
      </div>
    </article>
  `
  const image = container.querySelector<HTMLImageElement>('.detail-gallery img')!
  image.src = `${import.meta.env.BASE_URL}${product.image}`
  image.alt = product.name
  container.querySelector('h1')!.textContent = product.name
  container.querySelector('.detail-price')!.textContent = product.price === undefined ? ''
    : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(product.price)

  const quantity = container.querySelector<HTMLInputElement>('.quantity-control input')!
  const minus = container.querySelector<HTMLButtonElement>('.quantity-minus')!
  const plus = container.querySelector<HTMLButtonElement>('.quantity-plus')!
  function updateQuantity(change = 0) {
    const value = Math.min(99, Math.max(1, Math.trunc(Number(quantity.value) || 1) + change))
    quantity.value = String(value)
    minus.disabled = value === 1
    plus.disabled = value === 99
  }
  minus.addEventListener('click', () => updateQuantity(-1))
  plus.addEventListener('click', () => updateQuantity(1))
  quantity.addEventListener('change', () => updateQuantity())
  updateQuantity()
}
