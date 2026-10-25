import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CERTIFICATIONS_DATA,
  DEFAULT_THEME,
  HERO_STACK_BADGES,
  MOCK_CHART_HEIGHTS,
  MOCK_ROW_STATUSES,
  NAV_ITEMS,
  PRIMARY_STACK,
  PROJECTS_DATA,
  ProjectItem,
  SECTION_IDS,
  SKILL_CATEGORIES,
  STATS_DATA,
  SectionId,
  THEME_NAMES,
  THEME_OPTIONS,
  ThemeId,
} from './portfolio.data';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private readonly isBrowser: boolean;
  private revealObserver?: IntersectionObserver;
  private observedRevealElements = new WeakSet<Element>();
  private isClickScrolling = false;
  private clickScrollTimer?: ReturnType<typeof setTimeout>;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private copyTimer?: ReturnType<typeof setTimeout>;

  // ─── Static Data Bound to Template ────────────────────────
  readonly themeOptions = THEME_OPTIONS;
  readonly themeNames = THEME_NAMES;
  readonly navItems = NAV_ITEMS;
  readonly heroStackBadges = HERO_STACK_BADGES;
  readonly stats = STATS_DATA;
  readonly primaryStack = PRIMARY_STACK;
  readonly skillCategories = SKILL_CATEGORIES;
  readonly projects = PROJECTS_DATA;
  readonly certifications = CERTIFICATIONS_DATA;
  readonly mockChartHeights = MOCK_CHART_HEIGHTS;
  readonly mockRowStatuses = MOCK_ROW_STATUSES;

  // ─── Reactive UI Signals ──────────────────────────────────
  readonly currentTheme = signal<ThemeId>(DEFAULT_THEME);
  readonly themeMenuOpen = signal<'desktop' | 'mobile' | null>(null);
  readonly mobileDrawerOpen = signal(false);
  readonly activeSection = signal<SectionId>('home');

  readonly leetcodeLogo = computed(() =>
    this.currentTheme() === 'dark' ? 'assets/leetcode-dark.webp' : 'assets/leetcode.webp'
  );

  readonly currentThemeTitle = computed(() => `Theme: ${this.themeNames[this.currentTheme()]}`);
  readonly currentThemeAria = computed(
    () => `Change theme (currently ${this.themeNames[this.currentTheme()]})`
  );

  // ─── Carousel & Lightbox State ────────────────────────────
  readonly carouselPos = signal<number[]>(PROJECTS_DATA.map(() => 0));
  readonly lightbox = signal<{ open: boolean; projectIndex: number; slideIndex: number }>({
    open: false,
    projectIndex: 0,
    slideIndex: 0,
  });

  readonly activeLightboxProject = computed(
    () => this.projects[this.lightbox().projectIndex] ?? this.projects[0]
  );

  readonly activeLightboxCaption = computed(() => {
    const lb = this.lightbox();
    const p = this.activeLightboxProject();
    return `${p.slides[lb.slideIndex] || ''} · ${lb.slideIndex + 1} / ${p.slides.length}`;
  });

  // ─── Toast & Email Copy State ─────────────────────────────
  readonly toastMessage = signal('');
  readonly toastVisible = signal(false);
  readonly emailCopied = signal(false);

  // ─── Contact Form State (Web3Forms) ───────────────────────
  private readonly web3FormsKey = 'f4067688-857f-44a9-9372-d26c9c711b44';
  contactForm = {
    name: '',
    email: '',
    company: '',
    message: '',
  };
  readonly formErrors = signal<{ name: string; email: string; message: string }>({
    name: '',
    email: '',
    message: '',
  });
  readonly formSubmitting = signal(false);
  readonly formNote = signal<{ type: '' | 'show-success' | 'show-error'; text: string }>({
    type: '',
    text: '',
  });

  // ─── Hero Name Typewriter State ───────────────────────────
  @ViewChild('heroNameEl') heroNameEl?: ElementRef<HTMLElement>;
  readonly heroFullName = 'S M Nahid Hasan';
  readonly heroCursorBlinking = signal(false);
  private heroNameTimer?: ReturnType<typeof setTimeout>;
  private heroCursorTimer?: ReturnType<typeof setTimeout>;
  private heroNameIsHovered = false;
  private heroNameTypingStage: 'typing' | 'holding' | 'deleting' | 'paused' = 'holding';

  // ─── GitHub Terminal Animation State ──────────────────────
  readonly ghFullCmd = 'gh repo list DevNahidHasan --limit 5';
  readonly ghCmdText = signal(this.ghFullCmd);
  readonly ghStage = signal<'typing' | 'loading' | 'results' | 'done'>('done');
  readonly ghResultCount = signal<number>(4);
  private ghAnimTimer?: ReturnType<typeof setTimeout>;
  private ghIsHovered = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    let saved: ThemeId = DEFAULT_THEME;
    try {
      const fromStorage = localStorage.getItem('portfolio-theme') as ThemeId | null;
      if (fromStorage && this.themeNames[fromStorage]) {
        saved = fromStorage;
      }
    } catch {
      saved = DEFAULT_THEME;
    }
    this.setTheme(saved);
    this.updateActiveNav();
    this.startGhAnimationLoop();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupScrollReveal();
    this.updateActiveNav();
    this.startHeroNameAnimationLoop(500);
  }

  ngAfterViewChecked(): void {
    if (!this.isBrowser) return;
    this.syncRevealElements();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.clearGhAnimation();
    this.clearHeroNameAnimation();
    this.setHeroNameText(this.heroFullName);
    if (this.clickScrollTimer) clearTimeout(this.clickScrollTimer);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.copyTimer) clearTimeout(this.copyTimer);
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  // ─── Hero Name Typewriter Animation ───────────────────────
  startHeroNameAnimationLoop(initialDelay = 500): void {
    if (!this.isBrowser) return;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch {
      // Ignore media query error in non-standard environments
    }

    this.clearHeroNameAnimation();
    this.heroNameTimer = setTimeout(() => {
      this.typeHeroName(0);
    }, initialDelay);
  }

  private setHeroNameText(text: string): void {
    if (this.heroNameEl?.nativeElement) {
      // Use zero-width space (\u200B) when empty to lock line-box metrics and prevent baseline jump
      this.heroNameEl.nativeElement.textContent = text || '\u200B';
    }
  }

  private typeHeroName(charIdx: number): void {
    if (this.heroNameIsHovered) {
      this.heroNameTimer = setTimeout(() => this.typeHeroName(charIdx), 200);
      return;
    }
    this.heroNameTypingStage = 'typing';
    if (charIdx <= this.heroFullName.length) {
      this.setHeroNameText(this.heroFullName.slice(0, charIdx));
      if (charIdx < this.heroFullName.length) {
        this.heroNameTimer = setTimeout(() => this.typeHeroName(charIdx + 1), 50);
      } else {
        this.heroNameTypingStage = 'holding';
        // Blink 3 times (~3.3s) then rest calm and solid
        this.heroCursorBlinking.set(true);
        if (this.heroCursorTimer) clearTimeout(this.heroCursorTimer);
        this.heroCursorTimer = setTimeout(() => {
          this.heroCursorBlinking.set(false);
        }, 3300);
        this.scheduleHeroNameNextCycle(11000);
      }
    }
  }

  private deleteHeroName(charIdx: number): void {
    if (this.heroNameIsHovered) {
      this.heroNameTimer = setTimeout(() => this.deleteHeroName(charIdx), 200);
      return;
    }
    this.heroCursorBlinking.set(false);
    if (this.heroCursorTimer) clearTimeout(this.heroCursorTimer);
    this.heroNameTypingStage = 'deleting';
    if (charIdx >= 0) {
      this.setHeroNameText(this.heroFullName.slice(0, charIdx));
      if (charIdx > 0) {
        this.heroNameTimer = setTimeout(() => this.deleteHeroName(charIdx - 1), 28);
      } else {
        this.heroNameTypingStage = 'paused';
        this.heroNameTimer = setTimeout(() => {
          this.typeHeroName(0);
        }, 500);
      }
    }
  }

  private scheduleHeroNameNextCycle(delay: number): void {
    this.clearHeroNameAnimation();
    this.heroNameTimer = setTimeout(() => {
      if (this.heroNameIsHovered) {
        this.scheduleHeroNameNextCycle(1500);
      } else {
        this.deleteHeroName(this.heroFullName.length);
      }
    }, delay);
  }

  pauseHeroNameAnimation(): void {
    this.heroNameIsHovered = true;
  }

  resumeHeroNameAnimation(): void {
    this.heroNameIsHovered = false;
  }

  private clearHeroNameAnimation(): void {
    if (this.heroNameTimer) {
      clearTimeout(this.heroNameTimer);
      this.heroNameTimer = undefined;
    }
    if (this.heroCursorTimer) {
      clearTimeout(this.heroCursorTimer);
      this.heroCursorTimer = undefined;
    }
    this.heroCursorBlinking.set(false);
  }

  // ─── GitHub Terminal Animation ────────────────────────────
  startGhAnimationLoop(): void {
    if (!this.isBrowser) return;
    this.clearGhAnimation();

    this.ghStage.set('typing');
    this.ghCmdText.set('');
    this.ghResultCount.set(0);

    let charIdx = 0;
    const typeNext = () => {
      if (charIdx < this.ghFullCmd.length) {
        this.ghCmdText.set(this.ghFullCmd.slice(0, ++charIdx));
        this.ghAnimTimer = setTimeout(typeNext, 28);
      } else {
        this.ghAnimTimer = setTimeout(() => {
          this.ghStage.set('loading');
          this.ghAnimTimer = setTimeout(() => {
            this.ghStage.set('results');
            this.revealGhResultItem(1);
          }, 450);
        }, 180);
      }
    };

    this.ghAnimTimer = setTimeout(typeNext, 350);
  }

  private revealGhResultItem(itemIdx: number): void {
    this.ghResultCount.set(itemIdx);
    if (itemIdx < 4) {
      this.ghAnimTimer = setTimeout(() => {
        this.revealGhResultItem(itemIdx + 1);
      }, 140);
    } else {
      this.ghStage.set('done');
      this.scheduleGhNextCycle(3500);
    }
  }

  private scheduleGhNextCycle(delay: number): void {
    if (this.ghAnimTimer) clearTimeout(this.ghAnimTimer);
    this.ghAnimTimer = setTimeout(() => {
      if (!this.ghIsHovered) {
        this.startGhAnimationLoop();
      }
    }, delay);
  }

  pauseGhAnimation(): void {
    this.ghIsHovered = true;
  }

  resumeGhAnimation(): void {
    this.ghIsHovered = false;
    if (this.ghStage() === 'done') {
      this.scheduleGhNextCycle(1800);
    }
  }

  private clearGhAnimation(): void {
    if (this.ghAnimTimer) {
      clearTimeout(this.ghAnimTimer);
      this.ghAnimTimer = undefined;
    }
  }

  // ─── Theme Switcher ───────────────────────────────────────
  setTheme(theme: ThemeId): void {
    if (!this.themeNames[theme]) {
      theme = DEFAULT_THEME;
    }
    this.currentTheme.set(theme);
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch {
        // Ignore storage errors in restricted privacy modes
      }
    }
  }

  toggleThemeMenu(menu: 'desktop' | 'mobile', event: MouseEvent): void {
    event.stopPropagation();
    this.themeMenuOpen.update((curr) => (curr === menu ? null : menu));
  }

  selectTheme(theme: ThemeId, event: MouseEvent): void {
    event.stopPropagation();
    this.setTheme(theme);
    this.themeMenuOpen.set(null);
  }

  // ─── Mobile Drawer & Scrollspy Navigation ─────────────────
  toggleMobileMenu(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.mobileDrawerOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileDrawerOpen.set(false);
  }

  onNavClick(sectionId: SectionId): void {
    this.activeSection.set(sectionId);
    this.mobileDrawerOpen.set(false);
    this.isClickScrolling = true;
    if (this.clickScrollTimer) clearTimeout(this.clickScrollTimer);
    this.clickScrollTimer = setTimeout(() => {
      this.isClickScrolling = false;
      this.updateActiveNav();
    }, 750);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateActiveNav();
    this.syncRevealElements();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateActiveNav();
  }

  updateActiveNav(): void {
    if (!this.isBrowser || this.isClickScrolling) return;

    // 1. If at the very top of the page, Home is ALWAYS active
    if (window.scrollY < 80) {
      this.activeSection.set('home');
      return;
    }

    // 2. If scrolled to the bottom of the page, Contact is active
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
      this.activeSection.set('contact');
      return;
    }

    // 3. Find the section currently in view based on reading trigger line (upper 35% of viewport)
    const triggerLine = Math.min(260, Math.round(window.innerHeight * 0.35));
    let currentId: SectionId = 'home';

    for (const id of SECTION_IDS) {
      if (id === 'home') continue;
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= triggerLine) {
        currentId = id;
      }
    }

    this.activeSection.set(currentId);
  }

  // ─── Document-level Click & Keydown Listeners ─────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (this.themeMenuOpen() && !target.closest('.theme-picker')) {
      this.themeMenuOpen.set(null);
    }

    if (
      this.mobileDrawerOpen() &&
      !target.closest('#mobile-drawer') &&
      !target.closest('#hamburger-btn')
    ) {
      this.mobileDrawerOpen.set(false);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.lightbox().open) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        this.stepLightbox(-1);
      } else if (event.key === 'ArrowRight') {
        this.stepLightbox(1);
      }
      return;
    }

    if (event.key === 'Escape' && this.mobileDrawerOpen()) {
      this.mobileDrawerOpen.set(false);
    }
  }

  // ─── Project Carousel & Lightbox ──────────────────────────
  getSlidePos(projectIndex: number): number {
    return this.carouselPos()[projectIndex] ?? 0;
  }

  goToSlide(projectIndex: number, slideIndex: number, event?: Event): void {
    if (event) event.stopPropagation();
    const len = this.projects[projectIndex]?.slides.length || 1;
    const normalized = ((slideIndex % len) + len) % len;
    this.carouselPos.update((positions) => {
      const next = [...positions];
      next[projectIndex] = normalized;
      return next;
    });
  }

  stepCarousel(projectIndex: number, delta: number, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.getSlidePos(projectIndex);
    this.goToSlide(projectIndex, current + delta);
  }

  openLightbox(projectIndex: number, slideIndex?: number): void {
    const index = slideIndex ?? this.getSlidePos(projectIndex);
    this.lightbox.set({ open: true, projectIndex, slideIndex: index });
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('lb-close')?.focus();
      });
    }
  }

  closeLightbox(): void {
    const cur = this.lightbox();
    this.lightbox.set({ ...cur, open: false });
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
    this.goToSlide(cur.projectIndex, cur.slideIndex);
  }

  stepLightbox(delta: number): void {
    const cur = this.lightbox();
    const len = this.projects[cur.projectIndex]?.slides.length || 1;
    const nextSlide = ((cur.slideIndex + delta) % len + len) % len;
    this.lightbox.set({ ...cur, slideIndex: nextSlide });
  }

  selectLightboxThumb(slideIndex: number): void {
    this.lightbox.update((cur) => ({ ...cur, slideIndex }));
  }

  onLightboxBackdropClick(event: MouseEvent): void {
    const el = event.target as HTMLElement | null;
    if (!el) return;
    if (el.id === 'lb' || el.classList.contains('lb-stage')) {
      this.closeLightbox();
    }
  }

  onViewportKeydown(event: KeyboardEvent, projectIndex: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openLightbox(projectIndex);
    }
  }

  onDemoClick(event: MouseEvent, project: ProjectItem): void {
    if (!project.demo) {
      event.preventDefault();
      this.showToast('Live demo link coming soon');
    }
  }

  onVerifyClick(event: MouseEvent, verifyUrl: string): void {
    if (!verifyUrl || verifyUrl === '#') {
      event.preventDefault();
      this.showToast('Verification link coming soon');
    }
  }

  // ─── Toast Notification ───────────────────────────────────
  showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible.set(false);
    }, 2400);
  }

  // ─── Copy Email Address ───────────────────────────────────
  async copyEmail(): Promise<void> {
    if (!this.isBrowser) return;
    const email = 'smnahid.hsn@gmail.com';
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore fallback copy failure
      }
      document.body.removeChild(ta);
    }

    this.emailCopied.set(true);
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.emailCopied.set(false);
    }, 2200);
  }

  // ─── Contact Form Validation & Submission ─────────────────
  async onSubmitContactForm(event: Event): Promise<void> {
    event.preventDefault();

    const nameGood = this.contactForm.name.trim().length > 1;
    const emailGood = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.contactForm.email);
    const msgGood = this.contactForm.message.trim().length > 9;

    this.formErrors.set({
      name: nameGood ? '' : 'Please enter your name',
      email: emailGood ? '' : 'Enter a valid email address',
      message: msgGood ? '' : 'Message must be at least 10 characters',
    });

    if (!nameGood || !emailGood || !msgGood || !this.isBrowser) {
      return;
    }

    const submittedName = this.contactForm.name.trim();
    const submittedEmail = this.contactForm.email.trim();
    const submittedCompany = this.contactForm.company.trim();
    const submittedMessage = this.contactForm.message.trim();

    this.formSubmitting.set(true);
    this.formNote.set({ type: '', text: '' });

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: this.web3FormsKey,
          name: submittedName,
          email: submittedEmail,
          company: submittedCompany || 'N/A',
          message: submittedMessage,
          from_name: 'Portfolio Contact Form',
          subject: `New Portfolio Message from ${submittedName}${
            submittedCompany ? ' @ ' + submittedCompany : ''
          }`,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        this.contactForm = { name: '', email: '', company: '', message: '' };
        this.formErrors.set({ name: '', email: '', message: '' });
        this.formNote.set({
          type: 'show-success',
          text: `✓ Thank you, ${submittedName}! Your message has been delivered directly. I'll get back to you shortly.`,
        });
        this.showToast('Message sent successfully!');
      } else {
        this.formNote.set({
          type: 'show-error',
          text:
            result.message ||
            'Failed to send message. Please reach out directly via channels on the left.',
        });
      }
    } catch {
      this.formNote.set({
        type: 'show-error',
        text: 'Network error. Please try again or reach out via direct channels on the left.',
      });
    } finally {
      this.formSubmitting.set(false);
    }
  }

  // ─── Scroll Reveal Setup ──────────────────────────────────
  private setupScrollReveal(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
    }
    this.syncRevealElements();
  }

  private syncRevealElements(): void {
    if (!this.isBrowser) return;
    const pending = document.querySelectorAll('.reveal:not(.in)');
    if (!pending.length) return;

    const vh = window.innerHeight || document.documentElement.clientHeight || 800;

    pending.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Immediately reveal elements already within or above the visible viewport
      if (rect.top <= vh * 0.92 && rect.bottom >= -50) {
        el.classList.add('in');
        this.revealObserver?.unobserve(el);
        return;
      }

      if (!this.revealObserver) {
        el.classList.add('in');
        return;
      }

      if (!this.observedRevealElements.has(el)) {
        this.observedRevealElements.add(el);
        this.revealObserver.observe(el);
      }
    });
  }
}
