// login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      // 🔁 Already logged in → redirect to home/dashboard
      this.router.navigate(['/home']); // or '/admin-dashboard'
      return false;
    }
    return true;
  }
}
