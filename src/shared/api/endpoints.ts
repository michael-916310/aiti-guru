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
  brand?: string
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

export const productsApi = {
  getPage(params: ProductsPageParams) {
    return httpClient.get<ProductsResponse>('/products', { params })
  },
}
