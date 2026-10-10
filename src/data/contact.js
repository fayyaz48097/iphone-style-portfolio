export const contactSection = {
  title: "Let's talk",
  subtitle: 'Chat with me live right here. If I’m away, leave your email and my reply will reach you.',
}

/** Messages Fayyaz "types" when the chat scrolls into view. `typingMs` is the typing-indicator time before each. */
export const chatGreeting = [
  { typingMs: 900, text: 'Hey! Thanks for stopping by 👋' },
  { typingMs: 1200, text: 'Need a backend that is fast, secure and easy to maintain? Tell me about your project below.' },
]

/** Copy for the live chat states. */
export const liveChatCopy = {
  connecting: 'Connecting…',
  online: 'Online now',
  busy: 'Busy right now',
  away: 'Usually replies within a few hours',
  fallbackStatus: 'Replies by email',
  hint: 'Replies usually come live. If I’m away, leave your email and I’ll get back to you.',
  awayNote: 'Thanks! I’m away right now, so I’ll reply as soon as I’m back.',
  busyNote: 'I might be busy at the moment. I’ll answer as soon as I can.',
  emailPrompt: 'Leave your email so my reply doesn’t get lost:',
  fallbackReply: 'Love it. Opening your email app so this reaches me directly. You can also write to',
}

export const CHAT_REPLY_TYPING_MS = 1000
export const CHAT_HANDOFF_DELAY_MS = 900
