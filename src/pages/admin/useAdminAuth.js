import { useEffect, useState } from 'react'
import { isAdmin } from '@/services/chat/chatService'
import { onUserChanged } from '@/services/firebase'

/**
 * Who is signed in on the admin screen, and whether they're an admin
 * (listed under /admins in the database; the rules enforce the same check).
 *
 * @returns {{ loading: boolean, user: import('firebase/auth').User | null, admin: boolean }}
 */
export function useAdminAuth() {
  const [state, setState] = useState({ loading: true, user: null, admin: false })

  useEffect(
    () =>
      onUserChanged(async (user) => {
        // a leftover anonymous visitor session doesn't count as signed in here
        if (!user || user.isAnonymous) {
          setState({ loading: false, user: null, admin: false })
          return
        }
        setState({ loading: false, user, admin: await isAdmin(user.uid) })
      }),
    [],
  )

  return state
}
