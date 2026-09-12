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
    slug: 'redact-ai',
    name: 'Redact AI',
    blurb: 'Developer tool that redacts sensitive PII data from LLM prompts.',
    tags: ['Python', 'FastAPI', 'PyTorch', 'Ollama'],
  },
  {
    slug: 'lexvecta',
    name: 'LexVecta',
    blurb: 'Closed-domain hybrid RAG pipeline for corporate tax verification.',
    tags: ['Python', 'Streamlit', 'ChromaDB', 'SQLite'],
  },
  {
    slug: 'nova-cua',
    name: 'Nova-CUA',
    blurb: 'A JARVIS-like desktop agent that turns natural language into real actions on your computer.',
    tags: ['Python', 'LLMs', 'GUI Grounding', 'Docker'],
  },
  {
    slug: 'boilersub',
    name: 'BoilerSub',
    blurb: 'A gated, Purdue-only subleasing marketplace — verified, structured, on-platform.',
    tags: ['Supabase', 'TypeScript', 'OTP Auth', 'PostgreSQL'],
  },
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
      { key: 'spark', label: 'Apache Spark', file: 'spark.png' },
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
      { key: 'kubernetes', label: 'Kubernetes' },
      { key: 'azure', label: 'Microsoft Azure', file: 'azure.png' },
      { key: 'databricks', label: 'Databricks', file: 'databricks.png' },
      { key: 'postman', label: 'Postman' },
      { key: 'vercel', label: 'Vercel', file: 'vercel.png' },
      { key: 'claude', label: 'Claude' },
      { key: 'antigravity', label: 'Antigravity' },
      { key: 'ibm', label: 'IBM' },
    ],
  },
]

// Roles, newest first. `present: true` renders the small "Present" pill; dates
// are deliberately omitted — the ordering carries the timeline.
export const experience = [
  {
    company: 'Purdue University',
    role: 'Teaching Assistant — CS 252 Systems Programming',
    present: true,
    blurb: 'Hosted weekly lab sections with 20+ students and office hours for 400+ students on systems programming in C/C++, Linux, operating systems, concurrency, memory management, and networking.',
    tags: ['C', 'C++', 'Linux', 'Concurrency', 'Networking'],
  },
  {
    company: 'Cummins',
    role: 'Data Science Researcher',
    present: true,
    blurb: 'Developing an Agentic AI Platform Advisor to optimize Spark job workloads using Databricks. Building a closed-loop orchestration engine combining LLM reasoning, RAG, and PySpark on Azure to analyze cluster logs and dynamically generate CI/CD test pipelines.',
    tags: ['Databricks', 'PySpark', 'Azure', 'LLMs', 'RAG', 'CI/CD'],
  },
  {
    company: 'M-Assist CRM',
    role: 'Software Engineering Intern',
    blurb: 'Integrated third-party client REST APIs and shipped JWT-secured ASP.NET Core MVC for an enterprise CRM serving 400+ clients. Engineered a Knowledge Base-driven ELT engine to migrate legacy SQL Server reports to ClickHouse, reducing runtimes for SPs and report queries.',
    tags: ['ASP.NET Core', 'JWT', 'SQL Server', 'ClickHouse', 'REST'],
  },
  {
    company: 'Dekalb Capital Management LLC',
    role: 'Software Engineering Contract',
    blurb: 'Shipped an asynchronous REST polling engine with Ironbeam API routing designed to price options contracts through optimized low-latency Black-76 NumPy vectorizations. Deployed a React-based telemetry dashboard for real-time risk visualization and system monitoring.',
    tags: ['Python', 'NumPy', 'React', 'REST', 'Ironbeam API'],
  },
  {
    company: '3M Company',
    role: 'Data Science Researcher',
    blurb: "Engineered a GLIMS-integrated React dashboard for real-time hardware telemetry and inventory management to forecast lab consumable demand. Developed a Python + SQL backend to automate allocation of test samples across 145+ weathering machines at 3M's Weathering Research Centre, reducing lab downtime and operational bottlenecks.",
    tags: ['React', 'Python', 'SQL', 'GLIMS'],
  },
  {
    company: 'National University of Singapore',
    role: 'Software Developer Intern',
    blurb: 'Built an NLP-driven medical scheduling chatbot and computer vision applications using AWS infrastructure. Developed and optimized end-to-end ML pipelines through hyperparameter tuning and feature engineering to forecast customer churn in the telecom industry.',
    tags: ['AWS', 'NLP', 'TensorFlow', 'Computer Vision'],
  },
  {
    company: 'iXperience',
    role: 'Blockchain Intern',
    blurb: 'Designed decentralized identity verification strategies and smart contract architectures for blockchain-powered solutions.',
    tags: ['Blockchain', 'Smart Contracts', 'Digital Identity'],
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
  'options-risk-engine': {
    name: 'Options Risk Engine',
    subtitle: 'Options trading risk dashboard · Dekalb Capital Management LLC, Sycamore, IL',
    meta: ['React', 'FastAPI', 'Python', 'NumPy', 'Pandas', 'Cloudflare Workers', 'Ironbeam API'],
    images: [],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/dekalb-options-risk-engine' },
    ],
    lead: 'Prices a live options chain and shows the risk a trader is carrying — greeks, exposure, and P&L — in real time.',
    sections: [
      {
        heading: 'How it works',
        body: 'A FastAPI service polls the Ironbeam API for quotes and prices the whole chain with a vectorized Black-76 model. Greeks and exposure recompute on every tick and stream to a React front end.',
      },
      {
        heading: 'Architecture',
        body: 'An asyncio loop runs quote polling and repricing concurrently, so a slow network round-trip never blocks the chain from updating. The pricing core is a pure NumPy module with no I/O, which keeps it fast and unit-testable in isolation. The server holds the last chain snapshot and sends the client only what changed.',
      },
      {
        heading: 'Currently',
        body: 'Tracking micro WTI crude futures (MCL) and their options; the contract set is configurable.',
      },
    ],
    features: [
      { title: 'Vectorized pricing', body: 'The full chain is priced in one Black-76 pass over NumPy arrays, not contract-by-contract.' },
      { title: 'Live risk view', body: 'Greeks, net exposure, and P&L update on every quote tick.' },
      { title: 'Incremental updates', body: 'Only the strikes that moved are diffed and pushed to the client each tick.' },
    ],
  },
  'redact-ai': {
    name: 'Redact AI',
    subtitle: 'PII Sanitization for LLM Prompts',
    meta: ['Python', 'FastAPI', 'PyTorch', 'GLiNER2', 'spaCy', 'Ollama'],
    images: [],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/redact-ai' },
    ],
    lead: 'A dev tool that actively redacts sensitive data from prompts before they ever leave your machine.',
    sections: [],
    features: [
      { title: 'High recall sanitization', body: 'Achieves ≥93% recall in finding and removing PII exposure.' },
      { title: 'Semantic fidelity', body: 'Retains ≥85% of the original prompt meaning after sanitization.' },
      { title: 'Local LLM integration', body: 'Built to work seamlessly with Ollama.' },
    ],
  },
  'lexvecta': {
    name: 'LexVecta',
    subtitle: 'Automated Corporate Tax Verification',
    meta: ['Python', 'Streamlit', 'BAAI/BGE', 'ChromaDB', 'SQLite'],
    images: [],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/Jaden-Varkey/LexVecta' },
    ],
    lead: 'A closed-domain hybrid RAG pipeline designed to automate corporate tax verification for SMEs in the UAE.',
    sections: [],
    features: [
      { title: 'Hybrid RAG', body: 'Combines multiple retrieval strategies using BAAI/BGE and ChromaDB.' },
      { title: 'Low hallucination', body: 'Audited across lengthy multi-page documents with a near-zero hallucination rate.' },
      { title: 'Streamlit UI', body: 'Accessible and interactive frontend for tax professionals.' },
    ],
  },
}
