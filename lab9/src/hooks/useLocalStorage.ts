import { useEffect, useState } from 'react'

function readValue<T>(key: string, initialValue: T, isValid?: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return initialValue
    const parsed: unknown = JSON.parse(raw)
    return !isValid || isValid(parsed) ? (parsed as T) : initialValue
  } catch {
    // пошкоджений JSON або недоступне сховище — беремо початкове значення
    return initialValue
  }
}

/**
 * useState, значення зберігається в localStorage між перезавантаженнями.
 * isValid перевіряє збережене значення (наприклад, що фільтр — один з допустимих).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
) {
  // лінива ініціалізація: localStorage читається лише при першому рендері
  const [value, setValue] = useState<T>(() => readValue(key, initialValue, isValid))

  // запис у сховище — побічний ефект, тому він у useEffect
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // сховище недоступне — значення лишається в пам'яті
    }
  }, [key, value])

  // значення, змінене в іншій вкладці, підхоплюється через подію storage
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== key || event.newValue === null) return
      setValue(readValue(key, initialValue, isValid))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue, isValid])

  return [value, setValue] as const
}
