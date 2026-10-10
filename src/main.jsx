// Global styles first: they declare the Tailwind cascade layers every component stylesheet joins.
import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { profile } from '@/data/profile'
import { isChromium } from '@/lib/browser'
import { greetDevelopers } from '@/lib/console'
import { initAnalytics } from '@/services/firebase'
import App from './App.jsx'

// Decide on SVG refraction before the first paint so glass never flickers.
document.documentElement.classList.toggle('has-refraction', isChromium())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

greetDevelopers(profile.email)

// Analytics loads after the page is idle so it never competes with the first render (production only).
// (The Firebase SDKs themselves are fetched lazily inside initAnalytics.)
const whenIdle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 2000))
whenIdle(() => initAnalytics())
