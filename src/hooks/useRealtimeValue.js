import { useEffect, useState } from 'react'
import { subscribe } from '@/services/firebase'

/**
 * Live value from the Firebase Realtime Database.
 *
 * @example const { data: views, loading } = useRealtimeValue('stats/views')
 * @param {string | null} path    null/'' pauses the subscription
 * @returns {{ data: unknown, loading: boolean, error: Error | null }}
 */
export function useRealtimeValue(path) {
  // remember which path the snapshot belongs to, so switching paths reads as "loading"
  const [snapshot, setSnapshot] = useState({ path: null, data: null, error: null })

  useEffect(() => {
    if (!path) return undefined
    return subscribe(
      path,
      (data) => setSnapshot({ path, data, error: null }),
      (error) => setSnapshot({ path, data: null, error }),
    )
  }, [path])

  const current = snapshot.path === path
  return {
    data: current ? snapshot.data : null,
    error: current ? snapshot.error : null,
    loading: Boolean(path) && !current,
  }
}
