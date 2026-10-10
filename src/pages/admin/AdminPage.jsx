import { useState } from 'react'
import { Wallpaper } from '@/components/layout/Wallpaper'
import { Seo } from '@/components/seo/Seo'
import { SiriLoader } from '@/components/system/Siri/SiriLoader'
import { glass } from '@/components/ui/glass'
import { cn } from '@/lib/cn'
import { isFirebaseConfigured, signInWithGoogle, signOutUser } from '@/services/firebase'
import { AdminInbox } from './AdminInbox'
import { useAdminAuth } from './useAdminAuth'
import { ADMIN_TITLE } from './useUnreadAlerts'
import './AdminPage.css'

function Card({ children }) {
  return <div className={cn(glass(), 'admin-card')}>{children}</div>
}

function SignIn() {
  const [error, setError] = useState(null)
  return (
    <Card>
      <h1>Messages</h1>
      <p>Sign in with your Google account to answer chats from your portfolio.</p>
      <button
        type="button"
        className="admin-card__button"
        onClick={() => signInWithGoogle().catch((reason) => setError(reason.message))}
      >
        Sign in with Google
      </button>
      {error ? <p className="admin-error">{error}</p> : null}
    </Card>
  )
}

/** Signed in but not an admin: shows the UID to add under /admins in the database. */
function NotAuthorized({ user }) {
  const [copied, setCopied] = useState(false)
  return (
    <Card>
      <h1>Not an admin yet</h1>
      <p>
        <b>{user.email}</b> is signed in but isn’t listed as an admin. In the Firebase console, open Realtime Database
        and add <code>admins/&lt;your UID&gt; = true</code>:
      </p>
      <button
        type="button"
        className="admin-card__uid"
        onClick={() => navigator.clipboard?.writeText(user.uid).then(() => setCopied(true))}
      >
        {user.uid}
        <small>{copied ? 'Copied ✓' : 'Click to copy'}</small>
      </button>
      <p>Then reload this page.</p>
      <button type="button" className="admin-card__secondary" onClick={signOutUser}>
        Use another account
      </button>
    </Card>
  )
}

/** /admin: the reply screen for portfolio chats. Only listed admins get past the gate. */
export default function AdminPage() {
  const auth = useAdminAuth()

  let content
  if (!isFirebaseConfigured()) content = <Card><h1>Firebase is not configured</h1><p>Set the VITE_FIREBASE_* variables.</p></Card>
  else if (auth.loading) content = <SiriLoader label="Loading Messages" className="siri-loader--page" />
  else if (!auth.user) content = <SignIn />
  else if (!auth.admin) content = <NotAuthorized user={auth.user} />
  else content = <AdminInbox user={auth.user} />

  return (
    <div className="admin-page">
      {/* never in search results (also sent as an X-Robots-Tag header by vercel.json) */}
      <Seo title={ADMIN_TITLE} noIndex />
      <Wallpaper />
      {content}
    </div>
  )
}
