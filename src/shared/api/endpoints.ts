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

export const productsApi = {
  getAll() {
    return httpClient.get<ProductsResponse>('/products')
  },
}
