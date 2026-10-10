import { useId, useRef } from 'react'
import { CheckIcon, CloseIcon, DownloadIcon, ExternalLinkIcon } from '@/components/icons'
import { ActionButton } from '@/components/ui/ActionButton'
import { AppIcon } from '@/components/ui/AppIcon'
import { glass } from '@/components/ui/glass'
import { OVERLAYS } from '@/constants'
import { profile } from '@/data/profile'
import { resumeFile } from '@/data/resume'
import { useAppActions } from '@/hooks/useAppActions'
import { useDialogFocus } from '@/hooks/useDialogFocus'
import { cn } from '@/lib/cn'
import { downloadFile } from '@/lib/download'
import { formatBytes, formatMonthYear, pluralize } from '@/lib/format'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { useSettings } from '@/providers/settings/settings-context'
import { DOWNLOAD_STATE, useDownloadState } from './useDownloadState'
import './ResumeSheet.css'

const BUTTON_LABELS = {
  [DOWNLOAD_STATE.idle]: 'Download PDF',
  [DOWNLOAD_STATE.downloading]: 'Downloading…',
  [DOWNLOAD_STATE.done]: 'Downloaded',
}

/** iOS share-sheet style card for previewing and downloading the résumé PDF. */
export function ResumeSheet() {
  const titleId = useId()
  const downloadRef = useRef(null)
  const { isOpen, close } = useOverlay()
  const { reduceMotion } = useSettings()
  const { notify, fireConfetti } = useAppActions()
  const [downloadState, startDownload] = useDownloadState({ instant: reduceMotion })

  const visible = isOpen(OVERLAYS.resume)
  useDialogFocus(visible, downloadRef)

  const handleDownload = () => {
    if (downloadState === DOWNLOAD_STATE.downloading) return
    downloadFile(resumeFile.href, resumeFile.fileName)
    startDownload(() => {
      notify({ icon: '📄', title: 'Résumé downloaded', subtitle: resumeFile.fileName })
      fireConfetti(40)
    })
  }

  const details = [
    'PDF',
    pluralize(resumeFile.pages, 'page'),
    formatBytes(resumeFile.bytes),
  ].join(' · ')

  const DownloadStateIcon = downloadState === DOWNLOAD_STATE.done ? CheckIcon : DownloadIcon

  return (
    <div
      className={cn('resume-sheet', visible && 'resume-sheet--open')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!visible}
      inert={!visible}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className={cn(glass(), 'resume-sheet__panel')}>
        <span className="resume-sheet__grabber" aria-hidden="true" />

        <header className="resume-sheet__header">
          <h2 id={titleId} className="resume-sheet__title">
            {resumeFile.title}
          </h2>
          <button type="button" className="resume-sheet__close" aria-label="Close" onClick={close}>
            <CloseIcon />
          </button>
        </header>

        <div className="resume-sheet__body">
          <a
            className="resume-sheet__paper"
            href={resumeFile.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open résumé PDF in a new tab"
          >
            <img src={resumeFile.preview} alt={`First page of ${profile.name}'s résumé`} width="816" height="1056" />
          </a>

          <div className="resume-sheet__details">
            <div className="resume-sheet__file">
              <AppIcon icon={resumeFile.icon} size="sm" />
              <div className="resume-sheet__file-text">
                <b className="resume-sheet__file-name">{resumeFile.fileName}</b>
                <small className="resume-sheet__meta">{details}</small>
                <small className="resume-sheet__meta">Updated {formatMonthYear(resumeFile.updatedAt)}</small>
              </div>
            </div>

            <p className="resume-sheet__summary">
              {profile.name}, {profile.role.toLowerCase()}. {profile.headline}
            </p>

            <ul className="resume-sheet__tags" aria-label="Highlights">
              {resumeFile.highlights.map((tag, index) => (
                <li key={tag} className="resume-sheet__tag" style={{ '--i': index }}>
                  {tag}
                </li>
              ))}
            </ul>

            <div className="resume-sheet__actions">
              <button
                ref={downloadRef}
                type="button"
                className={cn('download-button', `download-button--${downloadState}`)}
                onClick={handleDownload}
                aria-live="polite"
              >
                <span className="download-button__progress" aria-hidden="true" />
                <DownloadStateIcon className="download-button__icon" />
                <span className="download-button__label">{BUTTON_LABELS[downloadState]}</span>
              </button>

              <ActionButton
                href={resumeFile.href}
                className="resume-sheet__open"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="resume-sheet__open-icon" />
                Open
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
