// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppUser } from './models/app-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.userData.asObservable(); // Expose as observable

  setUser(user: AppUser) {
    this.userData.next(user);
  }

  getUser(): AppUser | null {
    return this.userData.value;
  }

  // clearUser() {
  //   this.userData.next(null);
  // }
}
