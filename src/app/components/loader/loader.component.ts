import { Component, OnInit } from '@angular/core';
import {  PageLoaderService } from '../../services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  pageLoaded$ = this.pageLoaderService.pageLoaded$;

  constructor(private pageLoaderService: PageLoaderService) {}

  ngOnInit(): void {
    this.pageLoaderService.checkPageLoaded();
  }
}