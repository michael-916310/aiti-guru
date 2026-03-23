import { useCallback, useEffect, useState } from 'react'
import { productsApi, type Product } from '../../shared/api/endpoints'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'

export const PRODUCTS_PAGE_SIZE = 20

export function useProducts() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const skip = (page - 1) * PRODUCTS_PAGE_SIZE

  const load = useCallback(async () => {
    setFetching(true)
    setError(null)
    try {
      const { data } = await productsApi.getPage({
        limit: PRODUCTS_PAGE_SIZE,
        skip,
      })
      setProducts(data.products)
      setTotal(data.total)
    } catch (e) {
      setError(getApiErrorMessage(e, 'Не удалось загрузить товары'))
    } finally {
      setFetching(false)
    }
  }, [skip])

  useEffect(() => {
    void load()
  }, [load])

  const refetch = useCallback(() => load(), [load])

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const hasData = products.length > 0

  const rangeFrom = total === 0 ? 0 : skip + 1
  const rangeTo = skip + products.length

  return {
    products,
    total,
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
    totalPages,
    setPage,
    rangeFrom,
    rangeTo,
    fetching,
    error,
    refetch,
    showBlockingLoader: fetching && !hasData,
    showTopProgress: fetching && hasData,
  }
}
