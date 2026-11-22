// Узагальнені контракти репозиторію. Кожен описує одну можливість,
// тому сервіс реалізує лише ті, які йому потрібні.

export interface PageParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

/** Сторінка списку: елементи й дані для пагінації. */
export interface Page<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: PageParams): Promise<Page<T>>
  getById(id: number): Promise<T>
}

export interface Searchable<T> {
  search(query: string, params?: PageParams): Promise<Page<T>>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
