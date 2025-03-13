import { AfterViewInit, Component, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import gsap from 'gsap';

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

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Get the height of the first section
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
    }, 100); // Adjust the debounce delay (in milliseconds) as needed
  }

  /**
   * Handles the scroll event and triggers navbar animations.
   */
  private handleScroll(): void {
    const currentScrollPos = window.scrollY;

    // Only activate hide/show behavior after scrolling past the first section
    if (currentScrollPos > this.firstSectionHeight) {
      if (this.prevScrollPos + this.scrollThreshold < currentScrollPos) {
        // Scrolling down - Hide navbar
        this.hideNavbar();
      } else if (this.prevScrollPos - this.scrollThreshold > currentScrollPos) {
        // Scrolling up - Show navbar
        this.showNavbar();
      }
    }
    else{
      this.showNavbar()
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