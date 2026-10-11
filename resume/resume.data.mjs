/**
 * Résumé content. Edit this file, then run `npm run resume` to rebuild the PDFs.
 *
 * References (third-party phone numbers) live in `references.local.json` (git-ignored).
 * They always go into the private PDF, and into the public PDF on the website only
 * when `showReferencesPublicly` is true.
 */

/** true: the downloadable CV lists references; false: it says "Available upon request". */
export const showReferencesPublicly = true

export const resume = {
  name: 'Fayyaz Ali',
  title: 'Backend Developer | Laravel & PHP Specialist',
  contact: [
    { label: '+92 321 6886133', href: 'tel:+923216886133', underline: false },
    { label: 'iam.fayyazali@gmail.com', href: 'mailto:iam.fayyazali@gmail.com', underline: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fayyaz-ali-dev/', underline: true },
    { label: 'Portfolio', href: 'https://fayyaz-ali-portfolio.vercel.app/', underline: true },
  ],

  summary:
    'Backend Developer with over 2 years of hands-on experience building secure, scalable web applications in PHP and Laravel. Strong grounding in object-oriented programming, MVC and Action-Repository-Service architectures, RESTful API design, and MySQL query optimization. Practical experience implementing authentication/authorization and guarding against common web vulnerabilities (SQL injection, input validation, access control) in production applications. Comfortable working across the full backend lifecycle — from database schema design to API delivery — with working frontend exposure in React.js for full-stack collaboration. Plans and tracks work in Jira within Agile sprints, and uses Claude Code for AI-assisted development, reviewing and testing every AI-generated change.',

  skills: [
    ['Languages & Frameworks', 'PHP 8+, Laravel 12, JavaScript (ES6+), React.js, HTML5, CSS3'],
    ['Backend Architecture', 'MVC, Action-Repository-Service (ARS), RESTful API design, Form Requests, API Resources, DTOs'],
    ['Databases', 'MySQL (schema design & query optimization), Eloquent ORM, Firebase (Firestore, Realtime DB)'],
    ['Security & Auth', 'Authentication/authorization implementation, input validation, SQL injection prevention, secure coding practices'],
    ['Server & Environment', 'Working knowledge of Apache, Nginx, and php-fpm configuration for Laravel deployment; Laragon, XAMPP'],
    ['Project Management', 'Jira (Agile/Scrum sprints, issue and bug tracking, backlog management), Agile delivery workflows'],
    [
      'AI-Assisted Development',
      'Claude Code (agentic coding for feature implementation, refactoring, debugging, code review and documentation) with human review and testing of all output',
    ],
    ['Tools', 'Git, GitHub, Postman/API testing, OOP, DBMS fundamentals'],
  ],

  experience: [
    {
      role: 'Junior Laravel Developer',
      company: 'Dev Dimensions',
      period: 'Dec 2025 – Present',
      bullets: [
        'Build and maintain scalable Laravel applications using the Action-Repository-Service pattern, keeping business logic cleanly separated from data access for long-term maintainability.',
        'Design RESTful APIs using Form Requests, API Resources, and DTOs to enforce structured validation and consistent data contracts between frontend and backend.',
        'Optimize Eloquent ORM queries, relationships, and repository abstractions, improving performance across large-scale application modules.',
        'Strengthen application security and reliability through input validation, structured testing, and peer code review, following clean, well-documented coding standards.',
      ],
    },
    {
      role: 'React & Laravel Developer',
      company: 'Algo Soft Tech',
      period: 'May 2025 – Nov 2025',
      bullets: [
        'Developed and maintained dynamic, high-performance web applications combining Laravel backends with React.js frontends.',
        'Designed and implemented RESTful APIs and backend business logic supporting seamless frontend integration for two live e-commerce platforms (Max Auto Care, Saraye).',
        "Integrated MySQL databases via Laravel's Eloquent ORM, optimizing relationships and queries for efficient data handling.",
        'Applied authentication and authorization controls and validated inputs to guard against common web vulnerabilities during feature development.',
        'Architected scalable, maintainable MVC-based applications with reusable, documented code, and conducted testing/debugging for production reliability.',
      ],
    },
    {
      role: 'Backend Developer Intern',
      company: 'Innvobyte',
      period: 'Feb 2025 – Apr 2025',
      bullets: [
        'Built backend logic using Laravel controllers, routes, and Eloquent ORM for efficient data handling.',
        'Developed responsive, dynamic interfaces with Laravel Blade, HTML5, CSS3, and JavaScript (ES6+), wired to backend APIs.',
      ],
    },
    {
      role: 'Web Developer',
      company: 'Zaions',
      period: 'Apr 2024 – Dec 2024',
      bullets: [
        'Developed dynamic, data-driven web applications using PHP and MySQL, focused on responsive user experience.',
        'Built reusable PHP modules and backend logic to improve performance and scalability.',
        'Integrated MySQL databases with optimized queries and RESTful APIs for faster load times and seamless data flow.',
      ],
    },
    {
      role: 'Web Developer Intern',
      company: 'Zaions',
      period: 'Feb 2024 – Mar 2024',
      bullets: [
        'Developed user interfaces with modern JavaScript frameworks, HTML5, and CSS3, and built interactive prototypes for client presentations.',
      ],
    },
  ],

  projects: [
    {
      name: 'Moneta — Utility Billing Platform',
      period: 'Current',
      bullets: [
        'Architected and developed a high-scalability utility billing system for a US-based client using <b>Laravel 12</b> with an <b>Action-Repository-Service</b> architecture.',
        'Engineered core enterprise modules, including multi-tenant management, ERP integration, inventory tracking, and complex bill calculation engines.',
        'Implemented automated rate calculation algorithms for municipal utility services (electricity, water, gas) to enable precise invoice generation for public sector/government-level operations.',
      ],
    },
    {
      name: 'iPhone-Style Portfolio — AI-Assisted Build',
      period: '2026',
      bullets: [
        'Interactive iOS-themed portfolio (React 19, Vite, Tailwind CSS 4) built with <b>Claude Code</b> as an AI pair programmer: component architecture, reusable hooks, Liquid Glass UI, and a Siri assistant with a pluggable AI-API adapter and voice input.',
      ],
      links: [
        { label: 'fayyaz-ali-portfolio.vercel.app', href: 'https://fayyaz-ali-portfolio.vercel.app/' },
        { label: 'GitHub', href: 'https://github.com/fayyaz48097/iphone-style-portfolio' },
      ],
    },
    {
      name: 'Admin Portal — Max Auto Care',
      period: '2025',
      bullets: ['MVC-based Laravel application managing orders, products, and core business data operations.'],
    },
    {
      name: 'Max Auto Care & Saraye — Full-Stack E-commerce',
      period: '2025',
      bullets: [
        'Full-stack e-commerce platforms (React, Tailwind, Laravel, MySQL) for automotive parts and clothing retail, built during Algo Soft Tech tenure.',
      ],
      links: [
        { label: 'maxautocare.com.pk', href: 'https://maxautocare.com.pk/' },
        { label: 'Saraye Demo', href: 'https://saraye-app-obpp.vercel.app/' },
      ],
    },
    {
      name: 'Skill Sharing App (Final Year Project)',
      period: '2024–2025',
      bullets: [
        'Full-stack skill-sharing platform with admin control, gig/profile management, live chat, an AI chatbot (Gemini API), and Firebase Authentication.',
      ],
      links: [{ label: 'skill-sharing-app.vercel.app', href: 'https://skill-sharing-app.vercel.app/' }],
    },
    {
      name: 'Weather Forecast App',
      period: '2025',
      bullets: ['Real-time weather forecast web app built with React and the OpenWeatherMap API.'],
      links: [
        { label: 'weather-app-self-three-67.vercel.app', href: 'https://weather-app-self-three-67.vercel.app/' },
        { label: 'GitHub', href: 'https://github.com/fayyaz48097/WeatherApp' },
      ],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Science, Software Engineering',
      school: 'Minhaj University Lahore — CGPA: 3.67',
      period: '2021 – 2025',
    },
  ],

  certifications: [
    'The Complete JavaScript Course 2025: From Zero to Expert! — Udemy',
    'Advanced CSS and Sass: Flexbox, Grid, Animations and More! — Udemy',
    'Tailwind CSS From Scratch — Udemy',
    'PHP for Beginners: Become a PHP Master (CMS Project) — Udemy',
    'Legacy JavaScript Algorithm & Data Structures — freeCodeCamp (Certificate)',
    'Laravel MVC Architecture — Code-Step-by-Step (Self-Learning)',
  ],
}
