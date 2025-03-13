import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  private imagesLoadedSubject = new BehaviorSubject<boolean>(false);
  imagesLoaded$ = this.imagesLoadedSubject.asObservable();

  constructor() {}

  /**
   * Resets the state when navigating to a new page.
   */
  reset(): void {
    this.imagesLoadedSubject.next(false);
  }

  /**
   * Checks if all images on the page are loaded.
   */
  checkImagesLoaded(): void {
    const images = Array.from(document.querySelectorAll('img'));
    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        this.imagesLoadedSubject.next(true);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
        img.onerror = handleLoad;
      }
    });

    // If no images are found
    if (images.length === 0) {
      this.imagesLoadedSubject.next(true);
    }
  }
}
