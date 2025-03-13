import { Component, OnInit } from '@angular/core';
import { ImageLoaderService } from '../../services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  isLoading = true;

  constructor(private imageLoaderService: ImageLoaderService) {}

  ngOnInit(): void {
    // Check if all images are loaded
    this.imageLoaderService.checkImagesLoaded();

    // Subscribe to the image loading status
    this.imageLoaderService.imagesLoaded$.subscribe((loaded) => {
      if (loaded) {
        this.isLoading = false; // Hide the loader
      }
    });
  }
}