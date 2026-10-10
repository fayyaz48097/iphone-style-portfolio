import { useEffect, useState } from 'react'
import { storage } from '@/lib/storage'

/**
 * useState that persists to localStorage as JSON.
 * Falls back to in-memory state when storage is unavailable.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue))

  useEffect(() => {
    storage.set(key, value)
  }, [key, value])

  return [value, setValue]
}
