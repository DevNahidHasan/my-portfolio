import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render hero heading', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('S M Nahid Hasan');
  });

  it('should render all 6 portfolio projects', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const projectCards = compiled.querySelectorAll('#projects-list .proj');
    expect(projectCards.length).toBe(6);
  });

  it('should switch themes and update document data-theme attribute', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.setTheme('dark');
    expect(app.currentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(app.leetcodeLogo()).toBe('assets/leetcode-dark.webp');

    app.setTheme('emerald');
    expect(app.currentTheme()).toBe('emerald');
    expect(document.documentElement.getAttribute('data-theme')).toBe('emerald');
    expect(app.leetcodeLogo()).toBe('assets/leetcode.webp');
  });
});
