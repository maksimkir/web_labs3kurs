export interface AppTableColumn {
  field: string
  header: string
  sortable?: boolean
  /** Ширина колонки або інші стилі заголовка. */
  style?: string
}

export type AppTableSortOrder = 'asc' | 'desc'
