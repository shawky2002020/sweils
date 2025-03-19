import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLoaderService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  Loaded = false;
  private gsapContext!: gsap.Context;
  private pageLoadSubscription!: Subscription;

  constructor(
    private pageLoaderService: PageLoaderService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.pageLoaderService.reset();
    this.pageLoaderService.checkPageLoaded();

    this.pageLoadSubscription = this.pageLoaderService.pageLoaded$.subscribe(
      (loaded) => {
        if (loaded) {
          this.Loaded = true;

          // Run GSAP animations after Angular fully loads the DOM
          setTimeout(() => this.runGSAPAnimations(), 200);
        }
      }
    );
  }

  private runGSAPAnimations(): void {
    // Running GSAP inside Angular's zone to prevent conflicts
    this.ngZone.runOutsideAngular(() => {
      this.gsapContext = gsap.context(() => {
        // Logo animation
        gsap.set('.home .logo', {
          y: '50vh',
          x: '50vw',
          xPercent: -50,
          scale: 2.5,
          yPercent: -50,
        });

        // Scroll animation for down arrow
        gsap.to('.scroll-down', {
          scrollTrigger: {
            trigger: '.scroll-down',
            start: 'bottom center',
            toggleActions: 'play reverse play reverse',
          },
          opacity: 0,
          duration: 1,
        });

        // Main GSAP timeline
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
        const sections = document.querySelectorAll('section:not(.img, .sec1, .head)');
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

        // Floating effect for ingredients
        gsap.utils.toArray('.home .ingredients').forEach((ing: any,i) => {
          gsap.fromTo(
            ing,
            { y: -10},
            {
              y: 50,
              duration: 3,
              rotate: i<4?  80 : i>4? -80 : 0  ,
              repeat: -1,
              yoyo: true,
              ease: 'power2.inOut',
            }
          );
        });

        // Parallax effect for images
        gsap.utils.toArray('.home .img img').forEach((img, i) => {
          gsap.from(img as HTMLElement, {
            scrollTrigger: {
              trigger: img as HTMLElement,
              scrub: 1,
              end: i === 0 ? '200% center' : '100% center',
            },
            y: i === 0 ? -900 : -400,
          });
        });

        const ingtwine = gsap.timeline({
          scrollTrigger: {
            trigger: '.svg-container',
            start: 'top 80%', // Trigger earlier for a smoother effect
            scrub:.4,
            toggleActions: "play none none none",
            
          }
        });
        
        ingtwine
          .from('svg', {
            autoAlpha: 0, 
            scale: 0.7,
            duration: 2,
            ease: "power2.out"
          })
          .from('.svg-container figcaption', {
            autoAlpha: 0,
            y: -50,
            scale: 0.9,
            duration: 1.5, 
            ease: "power2.out"
          }, '0'); // Smooth transition instead of overlapping by -2

      });
    });
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert(); // Clean up GSAP animations
    }

    if (this.pageLoadSubscription) {
      this.pageLoadSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }
}
