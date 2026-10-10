import { JsonHighlight } from '@/components/ui/JsonHighlight'
import { experience } from '@/data/experience'
import { featuredProject, projects } from '@/data/projects'
import { resumeFile } from '@/data/resume'
import { profile } from '@/data/profile'
import { mailto, tel } from '@/lib/links'
import { Cmd, Dim, Key, Link, Num, Str } from './tokens'

const pad = (text, width) => text.padEnd(width, ' ')

const HELP = [
  ['whoami', `who is ${profile.firstName}`],
  ['curl /me', 'my profile as a JSON API response'],
  ['projects', 'things I have built'],
  ['skills', 'my stack'],
  ['experience', 'where I have worked'],
  ['php artisan', 'try it'],
  ['contact', 'how to reach me'],
  ['hire', 'you know you want to'],
  ['resume', 'view and download my CV'],
  ['siri', 'ask my assistant'],
  ['theme', 'toggle light and dark'],
  ['clear', 'clear the screen'],
]

const SKILL_LEVELS = [
  ['Laravel', 95],
  ['PHP', 92],
  ['REST APIs', 90],
  ['MySQL', 85],
  ['Security', 80],
  ['React', 70],
]

const PROFILE_RESPONSE = {
  data: {
    name: profile.name,
    role: 'Backend Developer',
    company: 'Dev Dimensions',
    stack: ['PHP 8+', 'Laravel 12', 'MySQL', 'React'],
    workflow: ['Jira', 'Claude Code'],
    architecture: 'Action-Repository-Service',
    experience_years: 2,
    available_for_hire: true,
    coffee_level: 'critical',
  },
}

export const SPECIAL = Object.freeze({ clear: '__clear', close: '__close' })

/** Shortcuts that resolve to a canonical command name. */
export const ALIASES = {
  curl: 'curl /me',
  me: 'curl /me',
  artisan: 'php artisan',
  'hire:fayyaz': 'php artisan hire:fayyaz',
  cv: 'resume',
  'résumé': 'resume',
  'cat resume.pdf': 'resume',
  clear: SPECIAL.clear,
  exit: SPECIAL.close,
  quit: SPECIAL.close,
}

/** Quick-tap chips under the output. */
export const SUGGESTIONS = ['help', 'curl /me', 'projects', 'skills', 'php artisan', 'hire']

export const INTRO_LINES = [
  <Dim key="login">Last login: today on portfolio</Dim>,
  'Welcome. This terminal is the backend of my portfolio.',
  <span key="hint">
    Type <Cmd>help</Cmd> or tap a command below.
  </span>,
]

/**
 * Builds the command registry. Each command returns the node to print.
 *
 * @param {{ fireConfetti: (n:number) => void, toggleTheme: () => void, openSiri: () => void, openResume: () => void }} context
 * @returns {Record<string, () => import('react').ReactNode>}
 */
export function createCommands({ fireConfetti, toggleTheme, openSiri, openResume }) {
  const hireLink = mailto(profile.email, { subject: profile.hireSubject })

  const projectRows = [featuredProject, ...projects].filter(({ terminalNote }) => terminalNote)

  return {
    help: () => (
      <>
        <Dim>Available commands</Dim>
        {HELP.map(([name, description]) => (
          <span key={name}>
            {'\n  '}
            <Cmd>{pad(name, 13)}</Cmd>
            {description}
          </span>
        ))}
      </>
    ),

    whoami: () =>
      `${profile.name}. Backend developer who writes Laravel and PHP for a living\nand treats clean architecture like a personal hobby.`,

    'curl /me': () => (
      <>
        <Dim>{'HTTP/1.1 200 OK\nContent-Type: application/json\nX-Powered-By: Laravel 12'}</Dim>
        {'\n\n'}
        <JsonHighlight value={PROFILE_RESPONSE} />
      </>
    ),

    projects: () =>
      projectRows.map(({ name, terminalNote, url }, index) => (
        <span key={name}>
          {index ? '\n' : ''}
          <Key>{pad(name, 18)}</Key>
          {terminalNote}
          {url ? (
            <>
              {'  '}
              <Link href={url}>{new URL(url).hostname}</Link>
            </>
          ) : null}
        </span>
      )),

    skills: () =>
      SKILL_LEVELS.map(([name, level], index) => {
        const filled = Math.round(level / 5)
        return (
          <span key={name}>
            {index ? '\n' : ''}
            {pad(name, 11)}
            <Cmd>{'█'.repeat(filled)}</Cmd>
            <Dim>{'░'.repeat(20 - filled)}</Dim>
          </span>
        )
      }),

    experience: () =>
      experience.map((job, index) => (
        <span key={job.id}>
          {index ? '\n' : ''}
          <Num>{job.code}</Num>
          {`  ${job.role}, ${job.company}`}
          {job.current ? (
            <>
              {'  '}
              <Str>current</Str>
            </>
          ) : null}
        </span>
      )),

    'php artisan': () => (
      <>
        <Str>Laravel Framework 12.x</Str>
        {'\n\n  '}
        <Cmd>make:magic</Cmd>
        {'      Turn requirements into clean code\n  '}
        <Cmd>optimize:query</Cmd>
        {'  Remove N+1 problems before they reach production\n  '}
        <Cmd>hire:fayyaz</Cmd>
        {'     Recommended'}
      </>
    ),

    'php artisan hire:fayyaz': () => {
      fireConfetti(160)
      return (
        <>
          <Str>{`   INFO  Hiring ${profile.firstName}...`}</Str>
          {'\n  Validating skills ................................ '}
          <Str>DONE</Str>
          {'\n  Running migrations for your project .............. '}
          <Str>DONE</Str>
          {'\n  Sending email ..................................... '}
          <Link href={mailto(profile.email)}>{profile.email}</Link>
        </>
      )
    },

    'php artisan make:magic': () => (
      <>
        <Str>   INFO  Magic [app/Magic.php] created successfully.</Str>
        {'\n  You are looking at it.'}
      </>
    ),

    contact: () => (
      <>
        {'email  '}
        <Link href={mailto(profile.email)}>{profile.email}</Link>
        {'\nphone  '}
        <Link href={tel(profile.phone)}>{profile.phone}</Link>
      </>
    ),

    hire: () => {
      fireConfetti(160)
      return (
        <>
          <Str>Great choice.</Str> <Link href={hireLink}>Open a draft email to {profile.firstName}</Link>
        </>
      )
    },

    theme: () => {
      toggleTheme()
      return 'Theme switched.'
    },

    siri: () => {
      openSiri()
      return 'Opening Siri…'
    },

    resume: () => {
      openResume()
      return (
        <>
          <Str>Opening résumé…</Str> or download directly: <Link href={resumeFile.href}>{resumeFile.fileName}</Link>
        </>
      )
    },

    sudo: () => (
      <>
        <Cmd>Permission denied.</Cmd> Nice try. Only validated requests get through here.
      </>
    ),

    'rm -rf /': () => (
      <>
        <Cmd>Blocked by a Form Request.</Cmd> I told you I validate input.
      </>
    ),

    ls: () => (
      <>
        about.md projects/ skills.json resume.pdf <Dim>.secret</Dim>
      </>
    ),

    'cat .secret': () => 'I have written more DTOs than text messages this year.',
  }
}

/** Normalises raw input into a registry key (aliases, `sudo anything` -> `sudo`). */
export function resolveCommand(input) {
  const key = input.trim().toLowerCase()
  if (key.startsWith('sudo')) return 'sudo'
  return ALIASES[key] ?? key
}

export const notFound = (input) => (
  <>
    <Dim>command not found: {input}. Type</Dim> <Cmd>help</Cmd>
  </>
)

export const echoPrompt = (input) => (
  <>
    <Cmd>~ $</Cmd> {input}
  </>
)
