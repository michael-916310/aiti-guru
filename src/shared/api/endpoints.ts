import { httpClient } from './httpClient'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  accessToken: string
  refreshToken?: string
}

export interface Product {
  id: number
  title: string
  price: number
  rating: number
  quantity?: number
  brand?: string
  /** Present on some API products; used for locally added rows */
  sku?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export const authApi = {
  login(payload: LoginRequest) {
    return httpClient.post<LoginResponse>('/auth/login', payload)
  },
}

export interface ProductsPageParams {
  limit: number
  skip: number
}

export interface ProductsSearchParams extends ProductsPageParams {
  q: string
}

function mapProductDto(raw: Record<string, unknown>): Product {
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ''),
    price: Number(raw.price ?? 0),
    rating: Number(raw.rating ?? 0),
    quantity:
      typeof raw.stock === 'number' && Number.isFinite(raw.stock)
        ? Number(raw.stock)
        : undefined,
    brand:
      raw.brand != null && String(raw.brand).trim() !== ''
        ? String(raw.brand)
        : undefined,
    sku:
      raw.sku != null && String(raw.sku).trim() !== ''
        ? String(raw.sku)
        : undefined,
  }
}

export function mapProductsResponseDto(data: ProductsResponse): ProductsResponse {
  return {
    ...data,
    products: data.products.map((p) =>
      mapProductDto(p as unknown as Record<string, unknown>),
    ),
  }
}

export const productsApi = {
  getPage(params: ProductsPageParams) {
    return httpClient.get<ProductsResponse>('/products', { params })
  },
  search(params: ProductsSearchParams) {
    return httpClient.get<ProductsResponse>('/products/search', { params })
  },
}
