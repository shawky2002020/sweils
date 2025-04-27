import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageLoaderService {
  private pageLoadedSubject = new BehaviorSubject<boolean>(true);
  pageLoaded$ = this.pageLoadedSubject.asObservable();

  constructor() {}

  /**
   * Resets the state when navigating to a new page.
   */
  reset(): void {
    // this.pageLoadedSubject.next(false);
  }

  /**
   * Checks if all images and CSS are fully loaded.
   */
  checkPageLoaded(): void {
    // const images = Array.from(document.querySelectorAll('img'));
    // let loadedCount = 0;

    // const handleLoad = () => {
    //   loadedCount++;
    //   if (loadedCount === images.length) {
    //     this.checkCSSLoaded();
    //   }
    // };

    // images.forEach((img) => {
    //   if (img.complete) {
    //     handleLoad();
    //   } else {
    //     img.onload = handleLoad;
    //     img.onerror = handleLoad;
    //   }
    // });

    // // If no images are found
    // if (images.length === 0) {
    //   this.checkCSSLoaded();
    // }
  }

  /**
   * Ensures that CSS is fully loaded.
   */
  private checkCSSLoaded(): void {
    // const styleSheets = Array.from(document.styleSheets);
    // let loadedStyles = true;

    // try {
    //   styleSheets.forEach((sheet) => {
    //     if (sheet.cssRules) {
    //       // Accessing cssRules will throw an error if the CSS hasn't fully loaded
    //       const rules = sheet.cssRules;
    //     }
    //   });
    // } catch (e) {
    //   loadedStyles = false;
    // }

    // if (loadedStyles) {
    //   this.pageLoadedSubject.next(true);
    // } else {
    //   // Retry after a short delay
    //   setTimeout(() => this.checkCSSLoaded(), 50);
    // }
  }
}
