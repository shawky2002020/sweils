import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { NavigationEnd, Router } from '@angular/router';
import { PageLoaderService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private pageLoaderService: PageLoaderService
  ) {}
}
