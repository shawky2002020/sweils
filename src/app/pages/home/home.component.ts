import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const t1 = gsap.timeline();
    gsap.set('.logo', {
      y: '50vh',
      x: '50vw',
      xPercent: -50,
      scale: 2,
      yPercent: -50,
    });
    t1.fromTo(
      '.logo',
      {
        y: '50vh',
        x: '50vw',
        xPercent: -50,
        scale: 2,
        yPercent: -50,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        yPercent: 0,
        xPercent: 0,
      }
    )
      .from('.features', { opacity: 0 })
      .from('.order', { opacity: 0 }, '>');

    ScrollTrigger.create({
      animation: t1,
      scrub: true,
      trigger: '.hero',
      start: 'top bottom',
      end: 'center bottom',
      onScrubComplete: () => gsap.from('.navbar', { opacity: 0 }),
    });
  }
}
