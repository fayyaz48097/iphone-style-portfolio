/*
 * Email templates. Everything a visitor typed is HTML-escaped before it goes into
 * an email. Inline styles only: email clients ignore stylesheets.
 */

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const formatTime = (ms) =>
  new Date(ms).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Karachi' })

function bubble(message, ownerLabel) {
  const mine = message.from === 'admin'
  return `
    <tr><td style="padding:4px 0;text-align:${mine ? 'right' : 'left'}">
      <div style="display:inline-block;max-width:85%;padding:10px 14px;border-radius:18px;
        ${mine ? 'background:#0066d6;color:#fff;border-bottom-right-radius:6px' : 'background:#efeaff;color:#14082f;border-bottom-left-radius:6px'};
        font-size:15px;line-height:1.4;text-align:left;white-space:pre-wrap">${escapeHtml(message.text)}</div>
      <div style="font-size:11px;color:#8a80a8;margin-top:3px">${mine ? 'Fayyaz' : escapeHtml(ownerLabel)} · ${formatTime(message.at)}</div>
    </td></tr>`
}

function layout({ title, intro, messages, ownerLabel, button, footer }) {
  return `<!doctype html><html><body style="margin:0;background:#f4f1ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(60,20,140,.12)">
      <tr><td style="padding:22px 24px;background:linear-gradient(135deg,#5b2bff,#ff4fd8);color:#fff">
        <div style="font-size:13px;opacity:.85">Fayyaz Ali · Portfolio</div>
        <div style="font-size:21px;font-weight:700;margin-top:4px">${escapeHtml(title)}</div>
      </td></tr>
      <tr><td style="padding:20px 24px 6px;color:#14082f;font-size:15px;line-height:1.5">${intro}</td></tr>
      <tr><td style="padding:8px 24px"><table role="presentation" width="100%">${messages.map((m) => bubble(m, ownerLabel)).join('')}</table></td></tr>
      <tr><td align="center" style="padding:18px 24px 26px">
        <a href="${escapeHtml(button.href)}" style="display:inline-block;padding:12px 26px;border-radius:999px;background:#0066d6;color:#fff;font-weight:700;text-decoration:none">${escapeHtml(button.label)}</a>
      </td></tr>
      <tr><td style="padding:0 24px 22px;color:#8a80a8;font-size:12px;line-height:1.5">${footer}</td></tr>
    </table>
  </td></tr></table></body></html>`
}

const asText = (messages, ownerLabel) =>
  messages.map((m) => `${m.from === 'admin' ? 'Fayyaz' : ownerLabel} (${formatTime(m.at)}): ${m.text}`).join('\n')

/** "New message" alert to Fayyaz. */
export function newMessageEmail({ messages, visitorEmail, adminUrl }) {
  const who = visitorEmail || 'A visitor'
  return {
    subject: `💬 New chat message from ${who}`,
    html: layout({
      title: 'New chat message',
      intro: `<b>${escapeHtml(who)}</b> wrote to you on your portfolio${visitorEmail ? '' : " (no email left yet)"}.`,
      messages,
      ownerLabel: visitorEmail || 'Visitor',
      button: { label: 'Open the chat', href: adminUrl },
      footer: 'You get at most one alert every 5 minutes per conversation. Reply from your admin screen.',
    }),
    text: `${who} wrote to you on your portfolio:\n\n${asText(messages, 'Visitor')}\n\nOpen the chat: ${adminUrl}`,
  }
}

/** Fayyaz's reply, sent to a visitor who has left. */
export function replyEmail({ messages, continueUrl }) {
  return {
    subject: 'Fayyaz replied to your message',
    html: layout({
      title: 'You have a reply',
      intro: 'Thanks for reaching out on my portfolio. Here is my reply:',
      messages,
      ownerLabel: 'You',
      button: { label: 'Continue the chat', href: continueUrl },
      footer:
        'The button reopens our conversation on any device. You can also just reply to this email.<br>You received this because you left your email in the chat on my portfolio.',
    }),
    text: `Fayyaz replied to your message:\n\n${asText(messages, 'You')}\n\nContinue the chat: ${continueUrl}`,
  }
}
