import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageLoaderService } from '../../services/loading.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  Loaded = false;
  private gsapContext!: gsap.Context;

  constructor(private imageLoaderService: ImageLoaderService) {}

  ngAfterViewInit(): void {
    this.gsapContext = gsap.context(() => {
      // Initial GSAP setup
      gsap.set('.home .logo', {
        y: '50vh',
        x: '50vw',
        xPercent: -50,
        scale: 2.5,
        yPercent: -50,
      });

      // Scroll animation for the down arrow
      gsap.to('.scroll-down', {
        scrollTrigger: {
          trigger: '.scroll-down',
          start: 'bottom center',
        },
        opacity: 0,
        duration: 1,
      });

      // Preload images before animations
      this.imageLoaderService.reset();
      this.imageLoaderService.checkImagesLoaded();

      this.imageLoaderService.imagesLoaded$.subscribe((loaded) => {
        if (loaded) {
          this.Loaded = true;
          this.initGSAPAnimations();
        }
      });
    });
  }

  private initGSAPAnimations(): void {
    // GSAP timeline for logo
    const t1 = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        scrub: 0.3,
        trigger: '.hero',
        start: 'top bottom',
        end: 'center bottom',
        invalidateOnRefresh: true,
      },
    });

    t1.to('.home .logo', {
      x: 0,
      y: 0,
      scale: 1,
      yPercent: 0,
      xPercent: 0,
    });

    // Section fade-in animations
    const sections = document.querySelectorAll('section:not(.img, .sec1, head)');
    sections.forEach((sec, i) => {
      gsap.from(sec.children, {
        opacity: 0,
        y: i % 2 ? 100 : 0,
        x: i % 2 ? 0 : 100,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: sec,
      });
    });

    // Infinite floating effect for ingredients
    (gsap.utils.toArray('.home .ingredients') as HTMLElement[]).forEach((ing: HTMLElement) => {
      gsap.fromTo(
        ing,
        { y: -5, rotate: 1 },
        { y: 5, rotate: -1, duration: 2, repeat: -1, yoyo: true, ease: 'power2.inOut' }
      );
    });

    // Image parallax effect
    const imgs = gsap.utils.toArray('.home .img img');
    imgs.forEach((img, i) => {
      gsap.from(img as HTMLElement, {
        scrollTrigger: {
          trigger: img as HTMLElement,
          scrub: 1,
          end: i === 0 ? '200% center' : '100% center',
        },
        y: i === 0 ? -900 : -400,
      });
    });

    // SVG animation
    const ingtwine = gsap.timeline({
      scrollTrigger: {
        trigger: 'svg',
        markers: true,
      },
    });

    ingtwine
      .from('svg', { opacity: 0.5, scale: 0, duration: 2, ease: 'power2.inOut' })
      .from('.svg-container figcaption', { opacity: 0, y: -100, scale: 0, duration: 2 }, '>-1.5');

    // Refresh ScrollTrigger after DOM update
    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    // Clean up GSAP context to avoid memory leaks
    this.gsapContext.revert();
  }
}
