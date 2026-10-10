import { SIRI_STATUS } from '@/constants'
import { profile } from './profile'

export const siriContent = {
  name: 'Siri',
  greeting: `Hi, I'm Siri.`,
  intro: `Ask me anything about ${profile.firstName}: skills, projects, experience or how to get in touch.`,
  placeholder: 'Ask Siri…',
  suggestions: [
    `What does ${profile.firstName} build?`,
    'Show me the projects',
    "What's the tech stack?",
    'Can I get the résumé?',
    'How do I get in touch?',
  ],
  footnote: {
    local: `Answers come from ${profile.firstName}'s portfolio.`,
    remote: 'AI answers can be wrong. Check important details.',
  },
  errorReply: "Sorry, I couldn't reach my brain just now. Try again in a moment.",
}

export const siriStatusLabels = {
  [SIRI_STATUS.idle]: `Ask me about ${profile.firstName}`,
  [SIRI_STATUS.listening]: 'Listening…',
  [SIRI_STATUS.thinking]: 'Thinking…',
  [SIRI_STATUS.responding]: 'Answering…',
  [SIRI_STATUS.error]: 'Something went wrong',
}
