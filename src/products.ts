export type ProductCategory =
  | 'laptop-stickers'
  | 'calendar'
  | 'griptok'
  | 'memo-pad'
  | 'eco-bag'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  // public 폴더 기준 경로 (예: products/sticker-01.png)
  image: string
  price?: number
  color?: string
}

export const products: Product[] = [
  {
    id: 'sticker-01',
    name: 'POTENTIAL sticker',
    category: 'laptop-stickers',
    image: 'products/sticker-01-mint.png',
    price: 6000,
    color: 'Mint / Black',
  },
]

export function selectProducts(catalog: readonly Product[], category?: string): Product[] {
  return category ? catalog.filter((product) => product.category === category) : [...catalog]
}
