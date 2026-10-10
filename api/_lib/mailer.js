import nodemailer from 'nodemailer'

/*
 * Gmail SMTP via an App Password. Credentials come only from server-side env vars
 * (MAIL_*), which are never bundled into the browser and never committed.
 */

const env = (name, fallback = '') => process.env[name]?.trim() || fallback

let transporter = null

function getTransporter() {
  if (!transporter) {
    const user = env('MAIL_USERNAME')
    const pass = env('MAIL_PASSWORD').replace(/\s+/g, '') // Google shows app passwords in groups of 4
    if (!user || !pass) throw new Error('MAIL_USERNAME / MAIL_PASSWORD are not set')

    const port = Number(env('MAIL_PORT', '587'))
    transporter = nodemailer.createTransport({
      host: env('MAIL_HOST', 'smtp.gmail.com'),
      port,
      secure: port === 465, // 587 upgrades with STARTTLS
      auth: { user, pass },
    })
  }
  return transporter
}

export const mailSender = () => ({
  name: env('MAIL_FROM_NAME', 'Portfolio'),
  address: env('MAIL_FROM_ADDRESS', env('MAIL_USERNAME')),
})

/** Where new-chat alerts go. */
export const adminInbox = () => env('CHAT_NOTIFY_TO', mailSender().address)

/** @param {{ to: string, subject: string, html: string, text: string, replyTo?: string }} message */
export async function sendMail({ to, subject, html, text, replyTo }) {
  const sender = mailSender()
  await getTransporter().sendMail({ from: sender, to, subject, html, text, replyTo })
}
