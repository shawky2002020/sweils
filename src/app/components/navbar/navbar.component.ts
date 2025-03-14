import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import gsap from 'gsap';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private prevScrollPos: number = window.scrollY;
  private scrollListener!: () => void;
  private debounceTimeout: any;
  private scrollThreshold = 10; // Small threshold to prevent flickering
  private firstSectionHeight: number = 0; // Height of the first section
  private targetSection: string | null = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.targetSection) {
          this.scrollToSection(this.targetSection);
          this.targetSection = null; // Reset after scrolling
        }
      });
  }

  /**
   * Scroll to a section with smooth behavior
   */
  scrollToSection(section: string): void {
    const currentRoute = this.router.url;
    if (currentRoute !== '/home') {
      this.targetSection = section; // Store section for later scroll after navigation
      this.router.navigate(['/home']);
    } else {
      this.viewportScroller.scrollToAnchor(section);
    }
  }

  ngAfterViewInit(): void {
    const firstSection = document.querySelector('.head');
    if (firstSection) {
      this.firstSectionHeight = firstSection.clientHeight;
    }

    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.cleanupScrollListener();
  }

  /**
   * Sets up the scroll event listener with debouncing.
   */
  private setupScrollListener(): void {
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.debounceScroll();
    });
  }

  /**
   * Cleans up the scroll event listener to prevent memory leaks.
   */
  private cleanupScrollListener(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  /**
   * Debounces the scroll event to improve performance.
   */
  private debounceScroll(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.handleScroll();
    }, 100); // Adjust debounce delay
  }

  /**
   * Handles the scroll event and triggers navbar animations.
   */
  private handleScroll(): void {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > this.firstSectionHeight) {
      if (this.prevScrollPos + this.scrollThreshold < currentScrollPos) {
        this.hideNavbar(); // Scrolling down
      } else if (this.prevScrollPos - this.scrollThreshold > currentScrollPos) {
        this.showNavbar(); // Scrolling up
      }
    } else {
      this.showNavbar();
    }

    this.prevScrollPos = currentScrollPos;
  }

  /**
   * Animates the navbar to hide it.
   */
  private hideNavbar(): void {
    gsap.to(this.el.nativeElement.querySelector('.navbar'), {
      y: '-100%',
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  /**
   * Animates the navbar to show it.
   */
  private showNavbar(): void {
    gsap.to(this.el.nativeElement.querySelector('.navbar'), {
      y: '0%',
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}
