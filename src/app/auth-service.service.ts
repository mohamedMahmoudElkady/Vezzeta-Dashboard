// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = new BehaviorSubject<User | null>(null); // Holds the logged-in user data
  currentUser$ = this.userData.asObservable(); // Expose as observable

  setUser(user: User) {
    this.userData.next(user);
  }

  getUser(): User | null {
    return this.userData.value;
  }

  clearUser() {
    this.userData.next(null);
  }
}
