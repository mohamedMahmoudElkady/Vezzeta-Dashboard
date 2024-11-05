import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router

  return authService.currentUser$.pipe(
    tap(user => {
      if (!user) {
        router.navigate(['/login']); // Redirect to login if user is not authenticated
      }
    }),
    map((user: any) => !!user) // Return true if user is authenticated, false otherwise
  );
};
