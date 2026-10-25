export type ThemeId = 'blue' | 'dark' | 'emerald' | 'teal';

/**
 * Change this ONE single value to change the site's default theme!
 * Available options: 'teal' | 'blue' | 'dark' | 'emerald'
 */
export const DEFAULT_THEME: ThemeId = 'teal';

export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'contact';

export interface ThemeOption {
  id: ThemeId;
  label: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface StatItem {
  icon: string;
  label: string;
  value: string;
  suffix?: string;
  description: string;
  warmIcon?: boolean;
}

export interface PrimaryStackItem {
  letter: string;
  name: string;
  color: string;
}

export interface SkillChip {
  name: string;
  hot?: boolean;
}

export interface SkillCategory {
  title: string;
  icon: string;
  chips: SkillChip[];
}

export interface ProjectItem {
  slug: string;
  name: string;
  cat: string;
  flagship?: boolean;
  tagline: string;
  bullets: string[];
  tags: string[];
  repo: string;
  demo: string;
  c: [string, string];
  g: [string, string];
  slides: string[];
  images: string[];
}

export interface CertificationItem {
  logo: string;
  date: string;
  title: string;
  issuer: string;
  tags: string[];
  credentialId: string;
  verifyUrl: string;
  specialLabel?: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'teal', label: 'Teal & Blue' },
  { id: 'dark', label: 'Dark Sleek' },
  { id: 'emerald', label: 'Emerald & Slate' },
  { id: 'blue', label: 'Royal Blue' },
];

export const THEME_NAMES: Record<ThemeId, string> = {
  teal: 'Teal & Blue',
  dark: 'Dark Sleek',
  emerald: 'Emerald & Slate',
  blue: 'Royal Blue',
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  // { id: 'certifications', label: 'Certifications' },
];

export const SECTION_IDS: SectionId[] = [
  'home',
  'about',
  'skills',
  'projects',
  'achievements',
  // 'certifications',
  'contact',
];

export const HERO_STACK_BADGES: { name: string; primary?: boolean }[] = [
  { name: 'Java', primary: true },
  { name: 'Spring Boot', primary: true },
  { name: 'Microservices' },
  { name: 'REST APIs' },
  { name: 'Keycloak' },
  { name: 'Angular' },
  { name: 'PostgreSQL' },
];

export const STATS_DATA: StatItem[] = [
  {
    icon: 'i-grad',
    label: 'Academic',
    value: '3.92',
    suffix: '/ 4.00',
    description: 'B.Sc. in CSE, Daffodil International University',
  },
  {
    icon: 'i-layers',
    label: 'Projects',
    value: '6 built',
    description: 'Microservices, full-stack web and Angular SPA',
  },
  {
    icon: 'i-trophy',
    label: 'Achievement',
    value: 'Section Champion',
    description: 'Take Off programming contest',
    warmIcon: true,
  },
  {
    icon: 'i-shield',
    label: 'Security',
    value: 'OAuth2 · Keycloak',
    description: 'Secure identity and role-based access',
  },
];

export const PRIMARY_STACK: PrimaryStackItem[] = [
  { letter: 'J', name: 'Java', color: '#e5732d' },
  { letter: 'S', name: 'Spring Boot', color: '#2fa66b' },
  { letter: 'M', name: 'Microservices', color: '#7a4bd1' },
  { letter: 'R', name: 'REST APIs', color: '#1c8fd6' },
  { letter: 'K', name: 'Keycloak', color: '#d6336c' },
  { letter: 'A', name: 'Angular', color: '#dd3b3b' },
  { letter: 'P', name: 'PostgreSQL', color: '#336791' },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Backend & Frameworks',
    icon: 'i-gear',
    chips: [
      { name: 'Java', hot: true },
      { name: 'Spring Boot', hot: true },
      { name: 'Spring MVC' },
      { name: 'Spring Security' },
      { name: 'Spring Data JPA' },
      { name: 'Hibernate' },
      { name: 'JDBC' },
    ],
  },
  {
    title: 'Architecture & Security',
    icon: 'i-shield',
    chips: [
      { name: 'Microservices', hot: true },
      { name: 'Keycloak', hot: true },
      { name: 'DDD' },
      { name: 'OAuth2 / OIDC' },
      { name: 'JWT' },
      { name: 'RBAC' },
      { name: 'API Gateway' },
      { name: 'Service Discovery' },
      { name: 'RESTful APIs' },
    ],
  },
  {
    title: 'Frontend',
    icon: 'i-code',
    chips: [
      { name: 'Angular', hot: true },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'RxJS' },
      { name: 'Thymeleaf' },
      { name: 'HTML5' },
      { name: 'CSS3 / SCSS' },
    ],
  },
  {
    title: 'Databases',
    icon: 'i-db',
    chips: [
      { name: 'PostgreSQL', hot: true },
      { name: 'MySQL' },
      { name: 'H2' },
      { name: 'SQL' },
      { name: 'ORM / JPA' },
    ],
  },
  {
    title: 'Computer Science',
    icon: 'i-brain',
    chips: [
      { name: 'Data Structures & Algorithms' },
      { name: 'OOP' },
      { name: 'Multithreading' },
      { name: 'Design Patterns' },
    ],
  },
  {
    title: 'Tools & DevOps',
    icon: 'i-tool',
    chips: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Docker' },
      { name: 'Maven' },
      { name: 'Gradle' },
      { name: 'Postman' },
      { name: 'IntelliJ IDEA' },
    ],
  },
];

/* ============ PROJECT DATA ============
   To use real screenshots, add paths to `images`, e.g.
   images: ['assets/rent/1.jpg','assets/rent/2.jpg'] — they replace the generated mock screens.
   Add the deployed URL to `demo` to enable the Live demo button. */
export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: 'rent-a-property',
    name: 'Rent-a-Property',
    cat: 'Microservices · Full-stack',
    flagship: true,
    tagline: 'Distributed property rental platform decomposed with Domain-Driven Design.',
    bullets: [
      'Architected services with DDD and a dedicated PostgreSQL database per service.',
      'Secured everything with Keycloak OAuth2/OIDC and JWT verification at the gateway.',
      'Dynamic service discovery and API Gateway routing for decoupled communication.',
      'Angular SPA with role-based route guards and automatic token refresh.',
    ],
    tags: ['Java', 'Spring Boot', 'Keycloak', 'OAuth2', 'Angular', 'PostgreSQL', 'API Gateway'],
    repo: 'https://github.com/RezaurOfficial/rent-a-property',
    demo: '',
    c: ['#2450eb', '#6d8cff'],
    g: ['#2450eb', '#7d9bff'],
    slides: ['Property search', 'Booking dashboard', 'Keycloak login'],
    images: [],
  },
  {
    slug: 'pokewiki',
    name: 'PokéWiki',
    cat: 'Angular SPA',
    tagline: 'Fast, responsive Pokémon encyclopedia consuming open REST APIs.',
    bullets: [
      'Reactive search, type filtering and pagination using RxJS observables.',
      'Modular Angular routing with sub-second client-side navigation.',
      'Responsive detail pages with stats and evolution chain, styled in SCSS.',
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'REST APIs', 'SCSS'],
    repo: 'https://github.com/DevNahidHasan',
    demo: '',
    c: ['#d9622b', '#f2a066'],
    g: ['#d9622b', '#f7b27f'],
    slides: ['Search & filter', 'Pokémon detail', 'Evolution chain'],
    images: [],
  },
  {
    slug: 'untold-stories',
    name: 'Untold Stories',
    cat: 'Spring Security · Full-stack',
    tagline: 'Anonymous campus experience-sharing platform with admin moderation.',
    bullets: [
      'Role-based access control (ROLE_USER / ROLE_ADMIN) with Spring Security.',
      'Anonymous submission pipeline with moderation and approval workflow.',
      'Input sanitization and validated persistence with JPA/Hibernate.',
    ],
    tags: ['Spring Boot', 'Spring Security', 'JPA', 'Thymeleaf', 'H2'],
    repo: 'https://github.com/DevNahidHasan',
    demo: '',
    c: ['#7a4bd1', '#a98af0'],
    g: ['#7a4bd1', '#b39af2'],
    slides: ['Anonymous feed', 'Submit a story', 'Admin moderation'],
    images: [],
  },
  {
    slug: 'deshimula-clone',
    name: 'Deshimula.com Clone',
    cat: 'E-commerce · Full-stack',
    tagline: 'Full-stack shop with catalog, cart, authentication and order persistence.',
    bullets: [
      'Product browsing, category filtering and cart management.',
      'Replaced manual SQL with Spring Data JPA, cutting boilerplate by ~50%.',
      'Spring Security for customer accounts and protected order workflows.',
    ],
    tags: ['Spring MVC', 'Spring Data JPA', 'Spring Security', 'PostgreSQL'],
    repo: 'https://github.com/DevNahidHasan',
    demo: '',
    c: ['#15906a', '#4cc9a0'],
    g: ['#15906a', '#66d6b0'],
    slides: ['Product catalog', 'Shopping cart', 'Checkout'],
    images: [],
  },
  {
    slug: 'quiz-craft',
    name: 'Quiz Craft',
    cat: 'Assessment engine',
    tagline: 'MCQ examination system with randomized questions and instant grading.',
    bullets: [
      'Dynamic question randomization across topic categories.',
      'Real-time scoring with a detailed result breakdown on submission.',
      'Clean MVC request lifecycle with form validation.',
    ],
    tags: ['Spring Boot', 'Spring Data JPA', 'Thymeleaf', 'PostgreSQL'],
    repo: 'https://github.com/DevNahidHasan',
    demo: '',
    c: ['#1c8fd6', '#6cc3f5'],
    g: ['#1c8fd6', '#7fcbf7'],
    slides: ['Quiz session', 'Result breakdown', 'Question bank'],
    images: [],
  },
  {
    slug: 'student-manager',
    name: 'Student Manager',
    cat: 'CRUD system',
    tagline: 'Academic records dashboard with validation and clean search.',
    bullets: [
      'Full CRUD enrollment operations backed by PostgreSQL.',
      'Server-side validation prevents invalid or duplicate records.',
      'Search and filter interface built with Thymeleaf.',
    ],
    tags: ['Spring Boot', 'Spring MVC', 'Thymeleaf', 'PostgreSQL'],
    repo: 'https://github.com/DevNahidHasan',
    demo: '',
    c: ['#192238', '#4a5878'],
    g: ['#27345a', '#5b6f9e'],
    slides: ['Student list', 'Enrollment form', 'Validation'],
    images: [],
  },
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    logo: 'J',
    date: 'Mar 2025',
    title: 'Java SE 17 Developer',
    issuer: 'Oracle University',
    tags: ['Java', 'OOP', 'Collections'],
    credentialId: 'JV-2025-0412',
    verifyUrl: '#',
    specialLabel: 'Core Certification',
  },
  {
    logo: 'S',
    date: 'Jan 2025',
    title: 'Spring Boot Microservices',
    issuer: 'Udemy · Instructor-led',
    tags: ['Spring Boot', 'API Gateway', 'Eureka'],
    credentialId: 'UC-8841-SB',
    verifyUrl: '#',
    specialLabel: 'Specialized Credential',
  },
  {
    logo: 'A',
    date: 'Nov 2024',
    title: 'Angular Developer',
    issuer: 'Coursera · Google Cloud',
    tags: ['Angular', 'RxJS', 'TypeScript'],
    credentialId: 'CR-7Q2L9X',
    verifyUrl: '#',
  },
  {
    logo: 'P',
    date: 'Aug 2024',
    title: 'PostgreSQL Administration',
    issuer: 'EDB Academy',
    tags: ['PostgreSQL', 'SQL', 'Indexing'],
    credentialId: 'PG-2024-5530',
    verifyUrl: '#',
  },
  {
    logo: 'K',
    date: 'Jun 2024',
    title: 'OAuth2 & Keycloak IAM',
    issuer: 'Spring Academy',
    tags: ['OAuth2', 'OIDC', 'JWT'],
    credentialId: 'SA-OA-1209',
    verifyUrl: '#',
  },
  {
    logo: 'D',
    date: 'Apr 2024',
    title: 'Docker Essentials',
    issuer: 'Docker Inc.',
    tags: ['Docker', 'Compose', 'Images'],
    credentialId: 'DK-2024-7781',
    verifyUrl: '#',
  },
];

export const MOCK_CHART_HEIGHTS = [40, 65, 50, 82, 60, 90, 72];
export const MOCK_ROW_STATUSES = ['New', 'Open', 'Done', 'Active'];

