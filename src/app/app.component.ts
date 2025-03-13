import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ImageLoaderService } from './services/loading.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  {

  constructor(
    private router: Router,
    private imageLoaderService: ImageLoaderService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.imageLoaderService.reset();
        this.imageLoaderService.checkImagesLoaded();
      }
    });
  }

}