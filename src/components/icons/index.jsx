/**
 * SF Symbols-style line icons. All icons inherit `currentColor` and accept any SVG prop.
 */
function SvgIcon({ children, strokeWidth = 1.9, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const MailIcon = (props) => (
  <SvgIcon strokeWidth={1.8} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </SvgIcon>
)

export const TerminalIcon = (props) => (
  <SvgIcon {...props}>
    <path d="m5 8 4 4-4 4" />
    <path d="M12 17h7" />
  </SvgIcon>
)

export const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h12v-9" />
  </SvgIcon>
)

export const PersonIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </SvgIcon>
)

export const GridIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </SvgIcon>
)

export const CodeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="m8 7-5 5 5 5" />
    <path d="m16 7 5 5-5 5" />
  </SvgIcon>
)

export const ClockIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </SvgIcon>
)

export const ChatIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 12c0-4 3.6-7 8-7s8 3 8 7-3.6 7-8 7c-1 0-2-.1-2.9-.4L5 20l1-3.3C4.7 15.4 4 13.8 4 12Z" />
  </SvgIcon>
)

export const SlidersIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 7h10" />
    <circle cx="17" cy="7" r="2.5" />
    <path d="M20 17H10" />
    <circle cx="7" cy="17" r="2.5" />
  </SvgIcon>
)

export const MoonIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </SvgIcon>
)

export const WaveIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M3 12c3-6 6 6 9 0s6 6 9 0" />
  </SvgIcon>
)

export const CopyIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="8" y="8" width="12" height="12" rx="3" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </SvgIcon>
)

export const MicIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </SvgIcon>
)

export const CloseIcon = (props) => (
  <SvgIcon strokeWidth={2.2} {...props}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </SvgIcon>
)

export const StopIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <rect x="7" y="7" width="10" height="10" rx="2.5" />
  </svg>
)

export const ComposeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <path d="M18.4 3.6a2 2 0 0 1 2.8 2.8L12 15.6 8.5 16.5l.9-3.5Z" />
  </SvgIcon>
)

export const DocumentIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </SvgIcon>
)

export const DownloadIcon = (props) => (
  <SvgIcon strokeWidth={2.1} {...props}>
    <path d="M12 4v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 20h14" />
  </SvgIcon>
)

export const CheckIcon = (props) => (
  <SvgIcon strokeWidth={2.6} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </SvgIcon>
)

export const ExternalLinkIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </SvgIcon>
)

export const TrashIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M10 11v6M14 11v6" />
  </SvgIcon>
)

export const ArrowUpIcon = (props) => (
  <SvgIcon strokeWidth={2.4} {...props}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </SvgIcon>
)
