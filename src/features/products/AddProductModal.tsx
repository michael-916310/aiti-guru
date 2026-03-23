import { useState, type FormEvent } from 'react'
import type { Product } from '../../shared/api/endpoints'
import styles from './AddProductModal.module.css'

export interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (product: Omit<Product, 'id'>) => void
}

export function AddProductModal({
  open,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [sku, setSku] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    price?: string
    brand?: string
    sku?: string
  }>({})

  function reset() {
    setTitle('')
    setPrice('')
    setBrand('')
    setSku('')
    setFieldErrors({})
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof fieldErrors = {}
    const t = title.trim()
    if (!t) next.title = 'Укажите наименование'
    const b = brand.trim()
    if (!b) next.brand = 'Укажите вендора'
    const s = sku.trim()
    if (!s) next.sku = 'Укажите артикул'
    const rawPrice = price.trim().replace(',', '.')
    const num = Number(rawPrice)
    if (!rawPrice) {
      next.price = 'Укажите цену'
    } else if (!Number.isFinite(num) || num < 0) {
      next.price = 'Введите неотрицательное число'
    }
    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }
    onSubmit({
      title: t,
      price: num,
      brand: b,
      sku: s,
      rating: 4.5,
    })
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) handleClose()
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <h2 id="add-product-title" className={styles.title}>
          Добавить товар
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-product-title-input">
              Наименование
            </label>
            <input
              id="add-product-title-input"
              className={`${styles.input} ${fieldErrors.title ? styles.inputError : ''}`}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={
                fieldErrors.title ? 'add-product-title-err' : undefined
              }
            />
            {fieldErrors.title ? (
              <p id="add-product-title-err" className={styles.fieldError} role="alert">
                {fieldErrors.title}
              </p>
            ) : null}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-product-price">
              Цена
            </label>
            <input
              id="add-product-price"
              type="text"
              inputMode="decimal"
              className={`${styles.input} ${fieldErrors.price ? styles.inputError : ''}`}
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              aria-invalid={Boolean(fieldErrors.price)}
              aria-describedby={
                fieldErrors.price ? 'add-product-price-err' : undefined
              }
            />
            {fieldErrors.price ? (
              <p id="add-product-price-err" className={styles.fieldError} role="alert">
                {fieldErrors.price}
              </p>
            ) : null}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-product-brand">
              Вендор
            </label>
            <input
              id="add-product-brand"
              className={`${styles.input} ${fieldErrors.brand ? styles.inputError : ''}`}
              value={brand}
              onChange={(ev) => setBrand(ev.target.value)}
              aria-invalid={Boolean(fieldErrors.brand)}
              aria-describedby={
                fieldErrors.brand ? 'add-product-brand-err' : undefined
              }
            />
            {fieldErrors.brand ? (
              <p id="add-product-brand-err" className={styles.fieldError} role="alert">
                {fieldErrors.brand}
              </p>
            ) : null}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-product-sku">
              Артикул
            </label>
            <input
              id="add-product-sku"
              className={`${styles.input} ${fieldErrors.sku ? styles.inputError : ''}`}
              value={sku}
              onChange={(ev) => setSku(ev.target.value)}
              aria-invalid={Boolean(fieldErrors.sku)}
              aria-describedby={
                fieldErrors.sku ? 'add-product-sku-err' : undefined
              }
            />
            {fieldErrors.sku ? (
              <p id="add-product-sku-err" className={styles.fieldError} role="alert">
                {fieldErrors.sku}
              </p>
            ) : null}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleClose}
            >
              Отмена
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
