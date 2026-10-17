import { Component, OnInit, OnDestroy, HostListener, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  // ─── Nav State ───────────────────────────────────────────
  isScrolled = signal(false);
  menuOpen = signal(false);
  activeSection = signal('home');
  currentYear = new Date().getFullYear();
  private observers: IntersectionObserver[] = [];

  // ─── Contact Form ─────────────────────────────────────────
  contactForm = {
    name: '',
    email: '',
    message: ''
  };
  formSubmitted = signal(false);
  formError = signal(false);

  // ─── Nav Links ────────────────────────────────────────────
  navLinks = [
    { id: 'home',           label: 'Home' },
    { id: 'about',          label: 'About' },
    //{ id: 'experience',     label: 'Experience' },
    { id: 'projects',       label: 'Projects' },
    { id: 'skills',         label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact',        label: 'Contact' },
  ];

  // ─── Data ─────────────────────────────────────────────────
  techStack = ['Angular', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker'];

  // ─── At A Glance (About Section) ──────────────────────────
  atAGlance = [
    {
      icon: 'education',
      text: 'B.E. — Electronics & Communication Engineering'
    },
    {
      icon: 'coffee',
      text: 'Java + Spring Boot'
    },
    {
      icon: 'react',
      text: 'React + JavaScript'
    },
    {
      icon: 'code',
      text: 'REST APIs'
    },
    {
      icon: 'database',
      text: 'MySQL · MongoDB · H2'
    },
    {
      icon: 'rocket',
      text: 'Full-Stack Development'
    },
    {
      icon: 'location',
      text: 'Mysore, India'
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
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  skillGroups = [
    {
      category: 'Languages',
      icon: '⌨️',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'HTML5', 'CSS3']
    },
    {
      category: 'Frontend',
      icon: '🎨',
      skills: ['Angular', 'RxJS', 'SCSS/SASS', 'Tailwind CSS', 'Chart.js', 'Material UI']
    },
    {
      category: 'Backend',
      icon: '⚙️',
      skills: ['Node.js', 'Express.js', 'FastAPI', 'Django', 'REST APIs', 'GraphQL']
    },
    {
      category: 'Databases',
      icon: '🗄️',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase']
    },
    {
      category: 'Tools & DevOps',
      icon: '🔧',
      skills: ['Git', 'Docker', 'GitHub Actions', 'Linux', 'Postman', 'Figma']
    },
    {
      category: 'Cloud & Hosting',
      icon: '☁️',
      skills: ['Cloudflare', 'AWS (S3, EC2)', 'Vercel', 'Netlify', 'DigitalOcean']
    }
  ];

  certifications = [
    {
      title: 'DIU CSE FEST Champion',
      issuer: 'Daffodil International University',
      date: 'Fall 2022',
      badge: '🏆',
      url: '#',
      color: '#10b981'
    },
    {
      title: 'Problem Solving (Intermediate)',
      issuer: 'HackerRank',
      date: 'Aug 2023',
      badge: '🏅',
      url: '#',
      color: '#10b981'
    },
    {
      title: 'Angular Developer Certification',
      issuer: 'HackerRank',
      date: 'Oct 2023',
      badge: '🏅',
      url: '#',
      color: '#10b981'
    },
    {
      title: 'JavaScript (Advanced)',
      issuer: 'HackerRank',
      date: 'Sep 2023',
      badge: '🏅',
      url: '#',
      color: '#10b981'
    },
    {
      title: 'SQL (Intermediate)',
      issuer: 'HackerRank',
      date: 'Nov 2023',
      badge: '🏅',
      url: '#',
      color: '#10b981'
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
    this.setupIntersectionObserver();
    this.setupScrollReveal();
  }

  ngOnDestroy(): void {
    this.observers.forEach(obs => obs.disconnect());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedProject()) {
      this.closeProjectModal();
    }
  }

  // ─── Navigation ───────────────────────────────────────────
  scrollTo(sectionId: string): void {
    this.menuOpen.set(false);
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

  // ─── Contact Form ─────────────────────────────────────────
  submitForm(): void {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.formError.set(true);
      setTimeout(() => this.formError.set(false), 3000);
      return;
    }
    // Simulate form submission
    this.formSubmitted.set(true);
    this.contactForm = { name: '', email: '', message: '' };
    setTimeout(() => this.formSubmitted.set(false), 5000);
  }
}
