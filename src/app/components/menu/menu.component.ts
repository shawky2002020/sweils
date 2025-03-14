import { gsap } from 'gsap';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { PageLoaderService } from '../../services/loading.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements AfterViewInit, OnDestroy {
  isLoading = true;
  @ViewChild('imagesWrapperEl', { static: false }) imagesWrapper!: ElementRef;
  counter = 0;
  private images!: HTMLElement[];
  private bullets!: HTMLElement[];
  private gsapContext!: gsap.Context;
  private intervalId!: number;
  private ngUnsubscribe = new Subject<void>();

  constructor(private imageLoaderService: PageLoaderService) {}

  ngAfterViewInit(): void {
    this.imageLoaderService.reset();
    this.imageLoaderService.checkPageLoaded();

    this.imageLoaderService.pageLoaded$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loaded) => {
        if (loaded) {
          this.isLoading = false;
          // Small delay to ensure the DOM is fully loaded
          setTimeout(() => {
            this.initGSAPAnimations();
          }, 0);
        }
      });
  }

  private initGSAPAnimations(): void {
    if (!this.imagesWrapper) return;

    this.images = Array.from(this.imagesWrapper.nativeElement.querySelectorAll('.image'));
    this.bullets = Array.from(document.querySelectorAll('.bullet'));

    if (this.images.length === 0 || this.bullets.length === 0) return;

    this.gsapContext = gsap.context(() => {
      gsap.set(this.images, { opacity: 0 });
      gsap.set(this.images[0], { opacity: 1 });
      this.bullets[0].classList.add('active');
      this.startAutoSlide();
    }, this.imagesWrapper.nativeElement);
  }

  private startAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = window.setInterval(() => {
      this.updateSlider();
    }, 4000);
  }

  updateSlider(): void {
    const currentIndex = this.counter;
    const nextIndex = (this.counter + 1) % this.images.length;

    gsap.to(this.images[currentIndex], {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.bullets[currentIndex].classList.remove('active');
        gsap.set(this.images[nextIndex], { opacity: 1 });
        this.bullets[nextIndex].classList.add('active');
      }
    });

    this.counter = nextIndex;
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
    clearInterval(this.intervalId);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
