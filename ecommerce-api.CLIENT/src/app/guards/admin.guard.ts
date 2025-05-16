import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(p0: unknown): boolean {
    const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage

    if (userRole === 'ADMIN') {
      return true; // Allow access
    } else {
      this.router.navigate(['/error/403']); // Redirect to 403 Forbidden error page
      return false;
    }
  }
}
