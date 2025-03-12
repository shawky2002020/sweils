import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }
  private animateNavbarSubject = new BehaviorSubject<boolean>(false);
  animateNavbar$ = this.animateNavbarSubject.asObservable();

  setAnimateNavbar(animate: boolean) {
    this.animateNavbarSubject.next(animate);
  }
}
