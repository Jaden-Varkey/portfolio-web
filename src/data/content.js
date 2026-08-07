// Single source of truth for all site content.

export const profile = {
  name: 'Jaden Varkey',
  intro: 'Software enthusiast with an interest in machine learning.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Jaden-Varkey/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jadenvarkey/', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:jadenvarkey@gmail.com', icon: 'gmail' },
  ],
}

export const projects = [
  {
    slug: 'ghostdrop',
    name: 'GhostDrop',
    blurb: 'Zero-knowledge, self-destructing secret sharing — encrypted in your browser, gone after the last view.',
    tags: ['Rust', 'Redis', 'WebCrypto API', 'Docker'],
  },
  {
    slug: 'openings-bot',
    name: 'Openings Bot',
    blurb: 'Get emailed or texted the instant a watched company opens a role matching your keywords — no scraping, no logins.',
    tags: ['Python', 'GitHub Actions', 'Vercel'],
  },
  {
    slug: 'nova-cua',
    name: 'Nova-CUA',
    blurb: 'A JARVIS-like desktop agent that turns natural language into real actions on your computer.',
    tags: ['Python', 'LLMs', 'GUI Grounding', 'Docker'],
    thumb: 'nova1.png',
  },
  {
    slug: 'boilersub',
    name: 'BoilerSub',
    blurb: 'A gated, Purdue-only subleasing marketplace — verified, structured, on-platform.',
    tags: ['Supabase', 'TypeScript', 'OTP Auth', 'PostgreSQL'],
    thumb: 'boilersub2.png',
  },
]

// Tech logos grouped by category. Each category becomes a marquee row.
// `key` maps to /public/logos/<key>.svg
export const techStack = [
  {
    label: 'Languages',
    items: [
      { key: 'python', label: 'Python' },
      { key: 'java', label: 'Java' },
      { key: 'c', label: 'C' },
      { key: 'cpp', label: 'C++' },
      { key: 'csharp', label: 'C#' },
      { key: 'r', label: 'R' },
      { key: 'sql', label: 'SQL', file: 'sql.png' },
      { key: 'javascript', label: 'JavaScript' },
      { key: 'html5', label: 'HTML5' },
      { key: 'css', label: 'CSS' },
    ],
  },
  {
    label: 'Frameworks & AI',
    items: [
      { key: 'react', label: 'React' },
      { key: 'jquery', label: 'jQuery' },
      { key: 'numpy', label: 'NumPy' },
      { key: 'tensorflow', label: 'TensorFlow' },
      { key: 'langchain', label: 'LangChain' },
      { key: 'langflow', label: 'Langflow' },
      { key: 'huggingface', label: 'Hugging Face' },
      { key: 'ollama', label: 'Ollama' },
      { key: 'nomic', label: 'Nomic' },
      { key: 'redis', label: 'Redis' },
    ],
  },
  {
    label: 'Dev Tools & Environments',
    items: [
      { key: 'vscode', label: 'VS Code' },
      { key: 'visualstudio', label: 'Visual Studio' },
      { key: 'intellij', label: 'IntelliJ' },
      { key: 'eclipse', label: 'Eclipse' },
      { key: 'vim', label: 'Vim' },
      { key: 'jupyter', label: 'Jupyter' },
      { key: 'ssms', label: 'SSMS', file: 'ssms.webp' },
      { key: 'git', label: 'Git' },
      { key: 'github', label: 'GitHub' },
      { key: 'copilot', label: 'GitHub Copilot' },
      { key: 'docker', label: 'Docker' },
      { key: 'postman', label: 'Postman' },
      { key: 'vercel', label: 'Vercel', file: 'vercel.png' },
      { key: 'claude', label: 'Claude' },
      { key: 'antigravity', label: 'Antigravity' },
      { key: 'ibm', label: 'IBM' },
    ],
  },
]

// Long-form copy for the two project detail pages.
export const projectDetails = {
  ghostdrop: {
    name: 'GhostDrop',
    subtitle: 'Zero-Knowledge, Self-Destructing Secret Sharing',
    meta: ['Rust', 'Axum', 'Redis', 'WebCrypto', 'Docker'],
    images: [],
    links: [
      { label: 'Try it Live', href: 'https://ghost-drop-kj83.onrender.com' },
      { label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/ghost-drop' },
    ],
    lead: 'A link that self-destructs. Encrypted in your browser — the server only ever sees ciphertext.',
    sections: [],
    features: [
      { title: 'Zero-knowledge', body: 'The decryption key never reaches the server.' },
      { title: 'Self-destructing', body: 'Vanishes after the view limit or expiry hits.' },
      { title: 'Poison tokens', body: 'Stops one refresh from burning every view.' },
    ],
  },
  'openings-bot': {
    name: 'Openings Bot',
    subtitle: 'Real-Time Internship & Job Alert Watcher',
    meta: ['Python', 'GitHub Actions', 'Vercel', 'Job Alerts'],
    images: [],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/openings-bot' },
      { label: 'Live App', href: 'https://openings-bot.vercel.app' },
    ],
    lead: 'Get an alert the instant a watched company opens a role matching your keywords — no scraping, no logins.',
    sections: [],
    features: [
      { title: 'Official API polling', body: 'Uses the same public endpoints career sites use, so it never gets blocked.' },
      { title: 'Only new postings', body: 'Baselines silently on first run, then alerts on new listings only.' },
      { title: 'Free & hosted', body: 'Runs on GitHub Actions; manage your list from a Vercel-hosted page.' },
    ],
  },
  'nova-cua': {
    name: 'Nova-CUA',
    subtitle: 'Multi-Agent Desktop Automation System',
    meta: ['AI Orchestration', 'LLMs', 'GUI Grounding', 'Docker'],
    images: ['nova1.png', 'nova2.png'],
    links: [
      { label: 'Live Preview', href: 'https://www.youtube.com/watch?v=IIIbjWweYmI' },
      { label: 'View on GitHub', href: 'https://github.com/buiilding/hello_world_hack' },
    ],
    lead: 'No manuals, no command syntax. Just say what you want — and your computer does it.',
    sections: [],
    features: [
      { title: 'Gemini 2.5 planning', body: 'Interprets instructions and generates the code to execute them.' },
      { title: 'GUI grounding', body: 'InternVL-4B identifies and interacts with on-screen elements.' },
      { title: 'Containerized', body: 'The whole pipeline runs in Docker.' },
    ],
  },
  boilersub: {
    name: 'BoilerSub',
    subtitle: 'Purdue-Exclusive Student Subleasing Marketplace',
    meta: ['Backend / Full-Stack', 'Supabase', 'OTP', '3D Panorama', 'Live Chat'],
    images: ['boilersub2.png', 'boilersub3.png', 'boilersub1.png'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/BoilerSub' }],
    lead: 'No more Facebook groups or DMing strangers for lease details — a clean, verified, Purdue-only platform.',
    sections: [],
    features: [
      { title: 'Purdue-only auth', body: '@purdue.edu gate with OTP verification.' },
      { title: '3D panoramas', body: 'Virtual walkthroughs before anyone reaches out.' },
      { title: 'Live messaging', body: 'Built-in threaded chat, no phone numbers needed.' },
    ],
  },
}
