import { aboutCards } from '@/data/about'
import { buildFlowSteps } from '@/data/buildFlow'
import { education } from '@/data/education'
import { experience } from '@/data/experience'
import { profile } from '@/data/profile'
import { featuredProject, projects } from '@/data/projects'
import { resumeFile, resumeUrl } from '@/data/resume'
import { homeScreenApps, homeScreenDock } from '@/data/skills'

const name = profile.firstName
const bullet = (lines) => lines.map((line) => `• ${line}`).join('\n')

/**
 * Offline "brain": intents matched by keyword, answered from the portfolio data files.
 * Every answer is built from src/data, so it stays in sync with the page.
 * The intent with the most pattern hits wins; on a tie, the earlier intent wins.
 */
export const intents = [
  {
    id: 'greeting',
    patterns: [/\b(hi|hello|hey|yo|salam|good (morning|afternoon|evening))\b/],
    answer: () =>
      `Hey! I'm Siri, ${name}'s assistant. Ask me about skills, projects, experience, education or how to get in touch.`,
  },
  {
    id: 'skills',
    patterns: [/\b(skills?|stack|tech|technolog(y|ies)|tools?|languages?|frameworks?|know|use)\b/],
    answer: () =>
      `${name}'s daily stack: ${homeScreenApps.map((app) => app.name).join(', ')}.\n\nTools in the dock: ${homeScreenDock
        .map((app) => app.name)
        .join(', ')}.`,
  },
  {
    id: 'projects',
    patterns: [/\b(projects?|built|build|portfolio|work|shipped|apps?|websites?|demo)\b/],
    answer: () =>
      `Right now ${name} is building ${featuredProject.name}: ${featuredProject.summary}\n\nShipped work:\n${bullet(
        projects.map((project) => `${project.name}: ${project.description}${project.url ? ` ${project.url}` : ''}`),
      )}`,
  },
  {
    id: 'current',
    patterns: [/\b(moneta|current(ly)?|now|working on|billing)\b/],
    answer: () =>
      `${name} is currently a ${experience[0].role} at ${experience[0].company}, building ${featuredProject.name}. ${featuredProject.summary}\n\n${bullet(featuredProject.highlights)}`,
  },
  {
    id: 'experience',
    patterns: [/\b(experience|jobs?|career|companies|company|worked|employment|history|years)\b/],
    answer: () =>
      `${name} has 2+ years of experience building for the web:\n${bullet(
        experience.map((job) => `${job.role} at ${job.company} (${job.period})`),
      )}`,
  },
  {
    id: 'education',
    patterns: [/\b(education|degree|university|study|studied|cgpa|gpa|courses?|certificat\w*)\b/],
    answer: () => {
      const [degree, ...courses] = education
      return `${degree.title} from ${degree.issuer}, ${degree.value}.\n\nCourses and certificates:\n${bullet(
        courses.map((course) => `${course.title} (${course.issuer})`),
      )}`
    },
  },
  {
    id: 'architecture',
    patterns: [/\b(architecture|pattern|endpoint|how .* build|process|clean code|repository|service|structure)\b/],
    answer: () =>
      `Every request takes the same clean path through ${name}'s Laravel code:\n${buildFlowSteps
        .map((step) => step.title)
        .join(' → ')}.\n\n${bullet(buildFlowSteps.map((step) => `${step.title}: ${step.description}`))}`,
  },
  {
    id: 'resume',
    // no \b around "résumé": é is not a word character, so the boundary would never match
    patterns: [/(\bresume\b|résumé|\bcv\b|curriculum)/],
    answer: () =>
      `Here's ${name}'s résumé (PDF, ${resumeFile.pages} pages): ${resumeUrl()}\n\nYou can also open the Résumé sheet from the document button on the lock screen or in the contact section.`,
  },
  {
    id: 'workflow',
    // separate patterns so a question naming several of these outranks the generic skills intent
    patterns: [/\bjira\b/, /\bclaude\b/, /\b(ai|ai-assisted|project management|agile|scrum|sprints?|workflow)\b/],
    answer: () =>
      `${name} plans and tracks work in Jira (Agile sprints, issue and bug tracking, backlog management) and uses Claude Code for AI-assisted development: implementing features, refactoring, debugging and code review, with every AI-generated change reviewed and tested. This portfolio itself was built with Claude Code.`,
  },
  {
    id: 'contact',
    patterns: [/\b(contact|email|mail|hire|hiring|available|availability|reach|call|phone|touch|freelance)\b/],
    answer: () =>
      `${name} is ${profile.status.title.toLowerCase()}. Email ${profile.email} or call ${profile.phone}. You can also send a message from the chat at the bottom of the page.`,
  },
  // generic, so it sits last: specific intents win ties
  {
    id: 'about',
    patterns: [/\b(who|about|introduce|background|summary|tell me)\b/],
    answer: () =>
      `${profile.name} is a ${profile.role.toLowerCase()} who builds secure, scalable Laravel and PHP backends, from database schema to API.\n\n${aboutCards[0].paragraphs.join(' ')}`,
  },
]

export const fallbackAnswer = () =>
  `I'm not sure about that one yet. I can tell you about ${name}'s skills, projects, experience, education, or how to get in touch.`

/** Picks the best-matching intent for a question and returns its answer. */
export function answerFor(question) {
  const text = question.toLowerCase()
  let best = null
  let bestScore = 0

  for (const intent of intents) {
    const score = intent.patterns.filter((pattern) => pattern.test(text)).length
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  return best ? best.answer() : fallbackAnswer()
}
