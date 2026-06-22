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
    slug: 'boilersub',
    name: 'BoilerSub',
    blurb: 'A gated, Purdue-only subleasing marketplace — verified, structured, on-platform.',
    tags: ['Supabase', 'Full-Stack', 'OTP Auth', 'Live Chat'],
    thumb: 'boilersub2.png',
  },
  {
    slug: 'nova-cua',
    name: 'Nova-CUA',
    blurb: 'A JARVIS-like desktop agent that turns natural language into real actions on your computer.',
    tags: ['Python', 'LLMs', 'GUI Grounding', 'Docker'],
    thumb: 'nova1.png',
  },
]

export const experience = [
  {
    company: '3M',
    role: 'Undergraduate Data Science Researcher',
    date: 'Jan — May 2026',
    location: 'West Lafayette, IN',
    line: 'Built a Python scoring engine routing 35,000+ samples across 100+ machines, with a tri-level rule engine that significantly reduced scheduling delays by 95%.',
    thumb: 'poster.png',
  },
  {
    company: 'National University of Singapore & AWS Bootcamp',
    role: 'Software Developer (ML & Cloud)',
    date: 'Jul — Aug 2023',
    location: 'Singapore',
    line: 'Led 6 students to build a diagnostic medical chatbot on Amazon Lex + Rekognition, and trained TensorFlow neural nets plus random-forest and regression pipelines up to 85% accuracy.',
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
    label: 'Libraries & Frameworks',
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
      { key: 'vercel', label: 'Vercel', file: 'vercel.png' },
      { key: 'claude', label: 'Claude' },
      { key: 'antigravity', label: 'Antigravity' },
      { key: 'ibm', label: 'IBM' },
    ],
  },
]

// Long-form copy for the two project detail pages.
export const projectDetails = {
  boilersub: {
    name: 'BoilerSub',
    subtitle: 'Purdue-Exclusive Student Subleasing Marketplace',
    meta: ['Backend / Full-Stack', 'Supabase', 'OTP', '3D Panorama', 'Live Chat'],
    images: ['boilersub2.png', 'boilersub3.png', 'boilersub1.png'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/BoilerSub' }],
    lead: 'No more Facebook groups, Snapchat stories, or DMing strangers for lease details. Just a clean, verified, Purdue-only platform.',
    sections: [
      {
        heading: 'The Problem',
        body: 'Finding a sublease near Purdue meant chasing unverified leads across Facebook, Snapchat, and Instagram DMs — noise, scams, and weeks of back-and-forth for basic details like price and availability.',
      },
      {
        heading: 'The Solution',
        body: 'BoilerSub is a gated, Purdue-exclusive marketplace for the West Lafayette housing market. It centralizes listings, standardizes property data, verifies every user, and keeps all communication on-platform.',
      },
    ],
    features: [
      { title: 'Purdue-only auth', body: 'A strict @purdue.edu gate with OTP email verification to block spam and build a high-trust user base.' },
      { title: 'Supabase backend', body: 'Scalable backend with secure data APIs, rate limiting, and owner-only row-level protections.' },
      { title: 'Scan-to-capture listings', body: 'A QR-driven flow to snap listing photos from your phone while building the listing on desktop.' },
      { title: '3D panoramas', body: 'An interactive panorama viewer for virtual walkthroughs before anyone reaches out.' },
      { title: 'Live messaging', body: 'Built-in threaded chat with edit/delete — no phone numbers or external DMs needed.' },
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
    lead: 'No manuals, no command syntax, no tutorials. Just say what you want — and your computer does it.',
    sections: [
      {
        heading: 'The Idea',
        body: '"Open LinkedIn and save ML internships." "Buy me the latest AirPods on Amazon." "Play Barcelona’s match highlights." Nova-CUA is a JARVIS-like desktop agent that interprets instructions, plans, and operates your desktop to carry them out.',
      },
      {
        heading: 'How it works',
        body: 'Gemini 2.5 handles planning and code generation for task execution, while InternVL-4B does GUI grounding — identifying and interacting with on-screen buttons, icons, and text. The whole pipeline is containerized with Docker.',
      },
    ],
    features: [],
  },
}
