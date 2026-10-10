import './Wallpaper.css'

const BLOBS = ['violet', 'pink', 'blue']

export function Wallpaper() {
  return (
    <div className="wallpaper" aria-hidden="true">
      {BLOBS.map((tone) => (
        <i key={tone} className={`wallpaper__blob wallpaper__blob--${tone}`} />
      ))}
    </div>
  )
}
