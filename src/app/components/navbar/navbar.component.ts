import { AfterViewInit, Component } from '@angular/core';
import gsap from 'gsap';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {
 

  ngAfterViewInit(): void {

    // GSAP Scroll Detection
    let prevScrollPos = window.scrollY;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        let currentScrollPos = window.scrollY;

        if (prevScrollPos < currentScrollPos) {
          // Scrolling down - Hide navbar
          gsap.to('.navbar', { y: '-100%', duration: 0.7, ease: 'power2.out' });
        } else {
          // Scrolling up - Show navbar
          gsap.to('.navbar', { y: '0%', duration: 0.3, ease: 'power2.out' });
        }

        prevScrollPos = currentScrollPos;
      }
      else{

      }
    });
  }
}
