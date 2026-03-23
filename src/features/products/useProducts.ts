import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  mapProductsResponseDto,
  productsApi,
  type Product,
} from '../../shared/api/endpoints'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'

export const PRODUCTS_PAGE_SIZE = 20

function filterLocalByQuery(list: Product[], q: string): Product[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return list
  return list.filter((p) => {
    const inTitle = p.title.toLowerCase().includes(needle)
    const inBrand = (p.brand ?? '').toLowerCase().includes(needle)
    const inSku = (p.sku ?? '').toLowerCase().includes(needle)
    return inTitle || inBrand || inSku
  })
}

export function useProducts(debouncedSearch: string) {
  const [page, setPage] = useState(1)
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const skip = (page - 1) * PRODUCTS_PAGE_SIZE
  const q = debouncedSearch.trim()
  const prevQ = useRef(q)

  useEffect(() => {
    if (prevQ.current !== q) {
      prevQ.current = q
      setPage(1)
    }
  }, [q])

  const load = useCallback(async () => {
    setFetching(true)
    setError(null)
    try {
      if (q) {
        const { data } = await productsApi.search({
          q,
          limit: PRODUCTS_PAGE_SIZE,
          skip,
        })
        const mapped = mapProductsResponseDto(data)
        setRemoteProducts(mapped.products)
        setTotal(mapped.total)
      } else {
        const { data } = await productsApi.getPage({
          limit: PRODUCTS_PAGE_SIZE,
          skip,
        })
        const mapped = mapProductsResponseDto(data)
        setRemoteProducts(mapped.products)
        setTotal(mapped.total)
      }
    } catch (e) {
      setError(getApiErrorMessage(e, 'Не удалось загрузить товары'))
    } finally {
      setFetching(false)
    }
  }, [skip, q])

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

  const localsVisible = useMemo(() => {
    if (q) return filterLocalByQuery(localProducts, q)
    if (page === 1) return localProducts
    return []
  }, [localProducts, q, page])

  const products = useMemo(
    () => [...localsVisible, ...remoteProducts],
    [localsVisible, remoteProducts],
  )

  const addLocalProduct = useCallback((payload: Omit<Product, 'id'>) => {
    const id = -Date.now()
    setLocalProducts((prev) => [{ ...payload, id }, ...prev])
  }, [])

  const hasData = products.length > 0

  const rangeFrom =
    total === 0 && localsVisible.length === 0 ? 0 : skip + 1
  const rangeTo = skip + remoteProducts.length

  return {
    products,
    searchActive: Boolean(q),
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
    addLocalProduct,
    showBlockingLoader: fetching && !hasData,
    showTopProgress: fetching && hasData,
  }
}
