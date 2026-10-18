import { Component, OnInit, OnDestroy, HostListener, signal, Pipe, PipeTransform, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Pipe({ name: 'highlightCode', standalone: true, pure: true })
export class HighlightCodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/(".*?")/g, '<span class="code-string">$1</span>')
      .replace(/\b(const|let|var|true|false)\b/g, '<span class="code-keyword">$1</span>')
      .replace(/(\w+)(?=\s*:)/g, '<span class="code-prop">$1</span>');
  }
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  featured?: boolean;
  status?: string;
  categoryBadge?: string;
  theme?: string;
  modalDetails: {
    problem: string;
    whatIBuilt: string;
    keyFeatures: string[];
  };
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private isBrowser: boolean;
  // ─── Nav State ───────────────────────────────────────────
  isScrolled = signal(false);
  menuOpen = signal(false);
  activeSection = signal('home');
  currentYear = new Date().getFullYear();
  private observers: IntersectionObserver[] = [];

  // ─── Image Lightbox ──────────────────────────────────────
  imageFullscreen = signal<string | null>(null);

  openImageFullscreen(src: string): void {
    this.imageFullscreen.set(src);
    if (this.isBrowser) {
      document.documentElement.classList.add('lightbox-open');
      document.body.classList.add('lightbox-open');
    }
  }

  closeImageFullscreen(): void {
    this.imageFullscreen.set(null);
    if (this.isBrowser) {
      document.documentElement.classList.remove('lightbox-open');
      document.body.classList.remove('lightbox-open');
    }
  }

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ─── Contact Form ─────────────────────────────────────────
  contactForm = {
    name: '',
    email: '',
    company: '',
    message: ''
  };
  fieldTouched = signal<{ name: boolean; email: boolean; message: boolean }>({
    name: false,
    email: false,
    message: false
  });
  formSubmitted = signal(false);
  formSubmitting = signal(false);
  formError = signal(false);
  formErrorMessage = signal('');
  // Web3Forms Access Key (get your free key from https://web3forms.com)
  web3formsAccessKey = 'f4067688-857f-44a9-9372-d26c9c711b44';

  getNameError(): string {
    const val = this.contactForm.name?.trim() || '';
    if (!val) return 'Please enter your name.';
    if (val.length < 2) return 'Name must be at least 2 characters.';
    return '';
  }

  getEmailError(): string {
    const val = this.contactForm.email?.trim() || '';
    if (!val) return 'Please enter your email address.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email (e.g. name@domain.com).';
    return '';
  }

  getMessageError(): string {
    const val = this.contactForm.message?.trim() || '';
    if (!val) return 'Please write a message.';
    if (val.length < 5) return 'Message must be at least 5 characters.';
    return '';
  }

  touchField(field: 'name' | 'email' | 'message'): void {
    this.fieldTouched.update(t => ({ ...t, [field]: true }));
  }


  // ─── Nav Links ────────────────────────────────────────────
  navLinks = [
    { id: 'home',           label: 'Home' },
    { id: 'about',          label: 'About' },
    //{ id: 'experience',     label: 'Experience' },
    { id: 'projects',       label: 'Projects' },
    { id: 'skills',         label: 'Skills' },
    //{ id: 'certifications', label: 'Certs' },
    { id: 'contact',        label: 'Contact' },
  ];

  // ─── Data ─────────────────────────────────────────────────
  techStack = ['Angular', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker'];

  // ─── At A Glance (About Section) ──────────────────────────
  atAGlance = [
    {
      icon: 'coffee',
      title: 'Core Java',
      desc: '> OOP · Collections Framework'
    },
    {
      icon: 'spring',
      title: 'Spring Ecosystem',
      desc: '> Spring Boot · MVC · Security · Data JPA · REST APIs'
    },
    {
      icon: 'database',
      title: 'Databases',
      desc: '> PostgreSQL · MySQL · H2'
    },
    {
      icon: 'rocket',
      title: 'Architecture',
      desc: '> Microservices · DDD · API Gateway · Service Discovery'
    },
    {
      icon: 'security',
      title: 'Security',
      desc: '> Keycloak · OAuth2 · JWT'
    },
    {
      icon: 'angular',
      title: 'Frontend & UI',
      desc: '> Angular · TypeScript · Thymeleaf · CSS'
    },
    {
      icon: 'tools',
      title: 'Tools & DevOps',
      desc: '> Git · GitHub · Postman · Gradle'
    },
    {
      icon: 'code',
      title: 'Problem Solving',
      desc: '> Data Structures · Algorithms'
    }
  ];

  experiences = [
    {
      number: '01',
      role: 'Software Developer',
      company: 'Tech Corp Inc.',
      period: 'Jan 2024 – Present',
      type: 'Full-time',
      highlights: [
        'Developed and maintained scalable web applications using Angular and Node.js, improving performance by 40%.',
        'Collaborated with cross-functional teams to design RESTful APIs consumed by 50K+ users monthly.',
        'Implemented CI/CD pipelines reducing deployment time by 60% using Docker and GitHub Actions.',
        'Mentored junior developers and conducted code reviews to maintain code quality standards.'
      ]
    },
    {
      number: '02',
      role: 'Frontend Developer Intern',
      company: 'StartUp Solutions',
      period: 'Jun 2023 – Dec 2023',
      type: 'Internship',
      highlights: [
        'Built responsive UI components using Angular and TypeScript for a SaaS dashboard product.',
        'Integrated third-party APIs and implemented real-time data visualization using Chart.js.',
        'Reduced initial load time by 35% through lazy loading and code splitting techniques.',
        'Participated in Agile sprints, daily standups, and contributed to sprint planning sessions.'
      ]
    }
  ];

  projects: Project[] = [
    {
      title: 'StaffHub',
      subtitle: 'Employee Management System',
      description: 'Full-stack employee management system supporting Admin, HR and Employee roles, with attendance, leave, payroll, tasks and employee management behind role-based access control and REST APIs.',
      image: 'assets/projects/staffhub.jpg',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'H2', 'JavaScript'],
      liveUrl: 'https://example.com/staffhub',
      githubUrl: 'https://github.com',
      featured: true,
      status: 'LIVE DEMO AVAILABLE',
      modalDetails: {
        problem: 'Organizations struggle with fragmented employee management tools, resulting in payroll miscalculations, delayed leave approvals, and lack of transparent role-based access controls.',
        whatIBuilt: 'Architected and built a full-stack enterprise portal with Spring Boot, Spring Security JWT authentication, modular REST APIs, automated payroll calculation, and role-tiered dashboards for Admins, HR managers, and employees.',
        keyFeatures: [
          'Admin, HR & Employee Role-Based Access Control',
          'Attendance tracking & leave approval workflows',
          'Automated payroll calculation & monthly slips',
          'Employee task assignment and progress tracking',
          'Secure JWT authentication with Spring Security',
          'Comprehensive RESTful API endpoints'
        ]
      }
    },
    {
      title: 'Salesforce CRUD App',
      subtitle: 'Salesforce Integration Application',
      description: 'React + FastAPI application that integrates with Salesforce using OAuth 2.0 and supports CRUD workflows on Salesforce data.',
      image: 'assets/projects/salesforce.jpg',
      tags: ['React', 'FastAPI', 'OAuth 2.0', 'REST APIs'],
      githubUrl: 'https://github.com',
      featured: false,
      categoryBadge: 'Salesforce Integration',
      theme: 'cyan',
      modalDetails: {
        problem: 'Standard Salesforce interfaces are complex and slow for field reps who need quick, streamlined customer and contact management without full CRM overhead.',
        whatIBuilt: 'Designed a lightweight, lightning-fast web application using React and Python FastAPI that connects directly to Salesforce via OAuth 2.0 to perform synchronized CRUD operations on contacts.',
        keyFeatures: [
          'OAuth 2.0 secure user authentication flow',
          'Real-time bi-directional contact synchronization',
          'Instant search, status filtering, and pagination',
          'Dynamic modal forms with validation for add/edit',
          'FastAPI high-speed async request handling',
          'Full CRUD error recovery and validation'
        ]
      }
    },
    {
      title: 'SkillGap AI',
      subtitle: 'Career Analysis Platform',
      description: 'Career analysis platform using rule-based scoring for job matching, missing-skill analysis, career roadmaps and interview preparation.',
      image: 'assets/projects/skillgap.jpg',
      tags: ['React', 'FastAPI', 'MongoDB', 'JavaScript'],
      liveUrl: 'https://example.com/skillgap',
      githubUrl: 'https://github.com',
      featured: false,
      categoryBadge: 'AI & Analytics Engine',
      theme: 'violet',
      modalDetails: {
        problem: 'Students and career switchers often know the role they want but not which exact skills are missing or what to learn first.',
        whatIBuilt: 'Built a platform that implements rule-based scoring across 5+ job roles, surfaces missing skills and returns career roadmaps with interview preparation — connecting a React frontend with FastAPI REST APIs.',
        keyFeatures: [
          'Job matching',
          'Missing-skill analysis',
          'Career roadmaps',
          'Interview preparation',
          'Rule-based scoring across 5+ job roles',
          'React + FastAPI REST APIs'
        ]
      }
    },
    {
      title: 'URL Shortener',
      subtitle: 'URL Shortening Service',
      description: 'URL shortening service built with Spring Boot and REST APIs, with a web interface for creating and managing shortened URLs.',
      image: 'assets/projects/urlshortener.jpg',
      tags: ['Java', 'Spring Boot', 'REST APIs', 'MySQL', 'Docker'],
      githubUrl: 'https://github.com',
      featured: false,
      categoryBadge: 'High-Throughput Microservice',
      theme: 'cyan',
      modalDetails: {
        problem: 'Businesses and creators require short, trackable links with detailed click analytics rather than relying on expensive third-party URL link shortening services.',
        whatIBuilt: 'Constructed a high-throughput URL shortening service using Base62 encoding, Redis caching for instant redirection, MySQL persistence, and comprehensive analytics tracking.',
        keyFeatures: [
          'Base62 encoding with collision prevention',
          'Sub-10ms redirection latency with caching',
          'Click tracking & analytics breakdown',
          'Custom vanity alias support & expiration dates',
          'Docker containerized deployment pipeline',
          'RESTful APIs with OpenAPI documentation'
        ]
      }
    }
  ];

  selectedProject = signal<Project | null>(null);

  get featuredProject(): Project | undefined {
    return this.projects.find(p => p.featured);
  }

  get regularProjects(): Project[] {
    return this.projects.filter(p => !p.featured);
  }

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
    if (this.isBrowser) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    }
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
    if (this.isBrowser) {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
  }

  skillGroups = [
    {
      category: 'Languages',
      icon: '⌨️',
      theme: 'amber',
      accentColor: '#f59e0b',
      skills: ['Java', 'TypeScript', 'JavaScript', 'SQL', 'HTML5', 'CSS3']
    },
    {
      category: 'Backend & Frameworks',
      icon: '⚙️',
      theme: 'emerald',
      accentColor: '#10b981',
      skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'JDBC', 'REST APIs']
    },
    {
      category: 'Architecture & Security',
      icon: '🛡️',
      theme: 'violet',
      accentColor: '#8b5cf6',
      skills: ['Microservices', 'Domain-Driven Design (DDD)', 'Keycloak (IAM)', 'OAuth2 / OIDC', 'JWT', 'API Gateway', 'Service Discovery']
    },
    {
      category: 'Frontend',
      icon: '🎨',
      theme: 'cyan',
      accentColor: '#06b6d4',
      skills: ['Angular', 'RxJS', 'Single Page Apps (SPA)', 'Thymeleaf', 'Responsive Design']
    },
    {
      category: 'Databases & Storage',
      icon: '🗄️',
      theme: 'teal',
      accentColor: '#14b8a6',
      skills: ['PostgreSQL', 'MySQL', 'H2 Database', 'ORM / JPA']
    },
    {
      category: 'Tools & DevOps',
      icon: '🔧',
      theme: 'orange',
      accentColor: '#f97316',
      skills: ['Git', 'GitHub', 'Postman', 'Gradle', 'Maven', 'Docker', 'VS Code', 'IntelliJ IDEA']
    }
  ];

  championAward = {
    title: 'DIU CSE FEST Champion',
    issuer: 'Daffodil International University',
    date: 'Fall 2022',
    badge: '🏆',
    rank: '1st Place Champion',
    category: 'Competitive Programming & Hackathon',
    credentialId: 'DIU-FEST-2022-CHAMP',
    description: 'Secured 1st Place in the premier university-wide competitive programming and software hackathon festival, outperforming top engineering teams across algorithmic problem-solving speed, precision, and strategy.',
    skills: ['Competitive Programming', 'Algorithms', 'Data Structures', 'Team Leadership'],
    url: '#',
    accentColor: '#f59e0b'
  };

  certifications = [
    {
      title: 'Angular Developer Certification',
      issuer: 'HackerRank',
      date: 'Oct 2023',
      badge: '⚡',
      iconType: 'angular',
      category: 'Frontend Architecture',
      credentialId: 'HR-ANG-DEV-5542',
      description: 'Standardized assessment evaluating components, directives, reactive forms, routing, RxJS streams, and component architecture.',
      skills: ['Angular', 'TypeScript', 'RxJS', 'Components & Routing'],
      url: 'https://www.hackerrank.com/certificates',
      color: '#dd0031'
    },
    {
      title: 'Problem Solving (Intermediate)',
      issuer: 'HackerRank',
      date: 'Aug 2023',
      badge: '🧠',
      iconType: 'problem-solving',
      category: 'Algorithms & Data Structures',
      credentialId: 'HR-PS-INT-8910',
      description: 'Rigorous assessment in algorithmic complexity, graph traversals, dynamic programming, and advanced data structure manipulation.',
      skills: ['Algorithms', 'Data Structures', 'Graph Theory', 'Optimization'],
      url: 'https://www.hackerrank.com/certificates',
      color: '#10b981'
    },
    {
      title: 'JavaScript (Advanced)',
      issuer: 'HackerRank',
      date: 'Sep 2023',
      badge: '📜',
      iconType: 'javascript',
      category: 'Core Language',
      credentialId: 'HR-JS-ADV-3104',
      description: 'Deep dive into asynchronous programming, event loop mechanics, closures, prototypal inheritance, and ES6+ features.',
      skills: ['JavaScript (ES6+)', 'Async/Await', 'Event Loop', 'Design Patterns'],
      url: 'https://www.hackerrank.com/certificates',
      color: '#f7df1e'
    },
    {
      title: 'SQL (Intermediate)',
      issuer: 'HackerRank',
      date: 'Nov 2023',
      badge: '💾',
      iconType: 'sql',
      category: 'Database Systems',
      credentialId: 'HR-SQL-INT-4821',
      description: 'Tested proficiency in complex multi-table joins, subqueries, grouping, window functions, and relational query optimization.',
      skills: ['SQL', 'Relational DBs', 'Complex Joins', 'Window Functions'],
      url: 'https://www.hackerrank.com/certificates',
      color: '#0284c7'
    }
  ];

  codeLines = [
    { indent: 0, text: 'const developer = {' },
    { indent: 1, text: 'name: "Your Name",' },
    { indent: 1, text: 'role: "Software Developer",' },
    { indent: 1, text: 'location: "Your City, Country",' },
    { indent: 1, text: 'stack: ["Angular", "Node", "Python"],' },
    { indent: 1, text: 'available: true,' },
    { indent: 1, text: 'passion: "Building great software"' },
    { indent: 0, text: '};' },
    { indent: 0, text: '' },
    { indent: 0, text: 'developer.build();' },
  ];

  // ─── Lifecycle ────────────────────────────────────────────
  ngOnInit(): void {
    if (this.isBrowser) {
      this.setupIntersectionObserver();
      this.setupScrollReveal();
    }
  }

  ngOnDestroy(): void {
    this.observers.forEach(obs => obs.disconnect());
    if (this.isBrowser) {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.imageFullscreen()) {
      this.closeImageFullscreen();
    } else if (this.selectedProject()) {
      this.closeProjectModal();
    }
  }

  // ─── Navigation ───────────────────────────────────────────
  scrollTo(sectionId: string): void {
    this.menuOpen.set(false);
    if (!this.isBrowser) return;
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  isActive(id: string): boolean {
    return this.activeSection() === id;
  }

  // ─── Intersection Observer for active nav ─────────────────
  private setupIntersectionObserver(): void {
    const sectionIds = this.navLinks.map(l => l.id);
    const options = { rootMargin: '-50% 0px -45% 0px', threshold: 0 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    // Defer to give DOM time to render
    setTimeout(() => {
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    this.observers.push(observer);
  }

  // ─── Scroll Reveal ────────────────────────────────────────
  private setupScrollReveal(): void {
    const options = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 200);

    this.observers.push(observer);
  }

  // ─── Contact Form (Web3Forms) ─────────────────────────────
  async submitForm(): Promise<void> {
    // Mark all fields as touched to display errors
    this.fieldTouched.set({ name: true, email: true, message: true });

    if (this.getNameError() || this.getEmailError() || this.getMessageError()) {
      return;
    }

    if (!this.isBrowser) return;

    this.formSubmitting.set(true);
    this.formError.set(false);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: this.web3formsAccessKey,
          name: this.contactForm.name,
          email: this.contactForm.email,
          company: this.contactForm.company || 'N/A',
          message: this.contactForm.message,
          from_name: 'Portfolio Contact Form',
          subject: `New Portfolio Message from ${this.contactForm.name}${this.contactForm.company ? ' @ ' + this.contactForm.company : ''}`
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.formSubmitted.set(true);
        this.contactForm = { name: '', email: '', company: '', message: '' };
        this.fieldTouched.set({ name: false, email: false, message: false });
        setTimeout(() => this.triggerConfetti(), 80);
      } else {
        this.formErrorMessage.set(result.message || 'Failed to send message. Please try again.');
        this.formError.set(true);
        setTimeout(() => this.formError.set(false), 5000);
      }
    } catch (err) {
      this.formErrorMessage.set('Network error. Please try again or email directly.');
      this.formError.set(true);
      setTimeout(() => this.formError.set(false), 5000);
    } finally {
      this.formSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.formSubmitted.set(false);
    this.contactForm = { name: '', email: '', company: '', message: '' };
    this.fieldTouched.set({ name: false, email: false, message: false });
  }

  // ─── Party Popper / Confetti Burst Animation ──────────────
  triggerConfetti(): void {
    if (!this.isBrowser) return;

    const canvas = document.querySelector('.party-popper-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = [
      '#38bdf8', // Electric Cyan
      '#34d399', // Emerald Green
      '#fbbf24', // Amber Gold
      '#a855f7', // Violet
      '#f43f5e', // Rose Red
      '#fde047', // Yellow
      '#ffffff'  // Crystal White
    ];

    interface ConfettiParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      wobble: number;
      wobbleSpeed: number;
      alpha: number;
      shape: 'rect' | 'circle' | 'star';
    }

    const particles: ConfettiParticle[] = [];

    // Cannon 1: Left Party Popper (shoots upward-right across the card)
    for (let i = 0; i < 45; i++) {
      const angle = (Math.random() * 45 + 35) * (Math.PI / 180);
      const speed = Math.random() * 13 + 7;
      particles.push({
        x: 15,
        y: canvas.height - 15,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        alpha: 1,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }

    // Cannon 2: Right Party Popper (shoots upward-left across the card)
    for (let i = 0; i < 45; i++) {
      const angle = (Math.random() * 45 + 100) * (Math.PI / 180);
      const speed = Math.random() * 13 + 7;
      particles.push({
        x: canvas.width - 15,
        y: canvas.height - 15,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        alpha: 1,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }

    // Cannon 3: Radial Sparkle Burst around Checkmark Icon
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.28;
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 16,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.15 + 0.05,
        alpha: 1,
        shape: 'star'
      });
    }

    let animationId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyAlive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.985; // air resistance
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        if (elapsed > 2000) {
          p.alpha -= 0.018;
        }

        if (p.alpha > 0 && p.y < canvas.height + 25) {
          anyAlive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(Math.sin(p.wobble), 1);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.6);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // 4-pointed sparkle star
            ctx.beginPath();
            for (let j = 0; j < 4; j++) {
              ctx.lineTo(Math.cos((j * Math.PI) / 2) * p.size, Math.sin((j * Math.PI) / 2) * p.size);
              ctx.lineTo(
                Math.cos((j * Math.PI) / 2 + Math.PI / 4) * (p.size * 0.35),
                Math.sin((j * Math.PI) / 2 + Math.PI / 4) * (p.size * 0.35)
              );
            }
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (anyAlive && elapsed < 4200) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);
  }
}
