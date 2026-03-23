import { useMemo, useState } from 'react'
import type { Product } from '../../shared/api/endpoints'
import { useDebouncedValue } from '../../shared/lib/useDebouncedValue'
import { useToast } from '../../shared/ui/toast/useToast'
import { AddProductModal } from './AddProductModal'
import { useProducts } from './useProducts'
import styles from './ProductsPage.module.css'

type SortField = 'price' | 'rating'

function sortProducts(
  list: Product[],
  field: SortField | null,
  dir: 'asc' | 'desc',
): Product[] {
  if (!field) return list
  const mult = dir === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    const va = a[field]
    const vb = b[field]
    if (va === vb) return 0
    return va < vb ? -1 * mult : 1 * mult
  })
}

function visiblePageNumbers(
  current: number,
  totalPages: number,
  maxButtons = 5,
): number[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  let start = Math.max(1, current - Math.floor(maxButtons / 2))
  let end = start + maxButtons - 1
  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - maxButtons + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function SortLabel({
  field,
  activeField,
  dir,
}: {
  field: SortField
  activeField: SortField | null
  dir: 'asc' | 'desc'
}) {
  const active = activeField === field
  const arrow = !active ? '↕' : dir === 'asc' ? '↑' : '↓'
  return (
    <>
      {field === 'price' ? 'Цена' : 'Рейтинг'}
      <span className={styles.sortHint} aria-hidden>
        {arrow}
      </span>
    </>
  )
}

export function ProductsScreen() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const [addOpen, setAddOpen] = useState(false)
  const { show: showToast } = useToast()

  const {
    products,
    searchActive,
    total,
    page,
    totalPages,
    setPage,
    rangeFrom,
    rangeTo,
    fetching,
    error,
    refetch,
    addLocalProduct,
    showBlockingLoader,
    showTopProgress,
  } = useProducts(debouncedSearch)

  const pageNums = visiblePageNumbers(page, totalPages)

  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(
    () => sortProducts(products, sortField, sortDir),
    [products, sortField, sortDir],
  )

  function onSortClick(field: SortField) {
    if (sortField !== field) {
      setSortField(field)
      setSortDir('asc')
      return
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className={styles.root}>
      <div
        className={`${styles.progressTrack} ${showTopProgress || showBlockingLoader ? styles.progressTrackVisible : ''}`}
        role="progressbar"
        aria-busy={fetching}
        aria-label="Загрузка товаров"
      >
        <div className={styles.progressIndeterminate} />
      </div>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Товары</h1>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Поиск"
              value={searchInput}
              onChange={(ev) => setSearchInput(ev.target.value)}
              aria-label="Поиск товаров"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setAddOpen(true)}
          >
            Добавить
          </button>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => void refetch()}
            disabled={fetching}
          >
            Обновить
          </button>
        </div>
      </div>

      {error && !showBlockingLoader ? (
        <p className={styles.errorBox} role="alert">
          {error}
        </p>
      ) : null}

      {showBlockingLoader ? (
        <div className={styles.blocking}>
          <p>Загрузка списка…</p>
        </div>
      ) : error && !products.length ? (
        <div className={styles.blocking}>
          <p className={styles.errorBox} role="alert">
            {error}
          </p>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => void refetch()}
            disabled={fetching}
          >
            Повторить
          </button>
        </div>
      ) : !products.length ? (
        <p className={styles.empty}>
          {searchActive
            ? 'Ничего не найдено.'
            : 'Список товаров пуст.'}
        </p>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Наименование</th>
                  <th className={styles.th}>
                    <button
                      type="button"
                      className={styles.thButton}
                      onClick={() => onSortClick('price')}
                      aria-sort={
                        sortField === 'price'
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <SortLabel
                        field="price"
                        activeField={sortField}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th className={styles.th}>
                    <button
                      type="button"
                      className={styles.thButton}
                      onClick={() => onSortClick('rating')}
                      aria-sort={
                        sortField === 'rating'
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <SortLabel
                        field="rating"
                        activeField={sortField}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th className={styles.th}>Вендор</th>
                  <th className={styles.th}>Артикул</th>
                  <th className={styles.th} aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.td}>{p.title}</td>
                    <td className={styles.td}>
                      {p.price.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className={styles.td}>
                      <span
                        className={
                          p.rating < 3.5 ? styles.ratingLow : undefined
                        }
                        aria-label={
                          p.rating < 3.5
                            ? `Рейтинг ${p.rating.toFixed(1)}, низкий`
                            : `Рейтинг ${p.rating.toFixed(1)}`
                        }
                      >
                        {p.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className={styles.td}>{p.brand ?? '—'}</td>
                    <td className={styles.td}>{p.sku ?? '—'}</td>
                    <td className={`${styles.td} ${styles.actionsCell}`}>
                      <span className={styles.menuStub} title="">
                        ···
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > 0 ? (
            <nav
              className={styles.paginationFooter}
              aria-label="Навигация по страницам"
            >
              <p className={styles.paginationSummary}>
                Показано{' '}
                {rangeFrom.toLocaleString('ru-RU')}–
                {rangeTo.toLocaleString('ru-RU')} из{' '}
                {total.toLocaleString('ru-RU')}
              </p>
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={fetching || page <= 1}
                  aria-label="Предыдущая страница"
                >
                  ‹
                </button>
                {pageNums.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={
                      num === page ? styles.pageNumActive : styles.pageNum
                    }
                    onClick={() => setPage(num)}
                    disabled={fetching}
                    aria-label={`Страница ${num}`}
                    aria-current={num === page ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={fetching || page >= totalPages}
                  aria-label="Следующая страница"
                >
                  ›
                </button>
              </div>
            </nav>
          ) : null}
        </>
      )}

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(payload) => {
          addLocalProduct(payload)
          showToast('Товар добавлен', 'success')
        }}
      />
    </div>
  )
}
