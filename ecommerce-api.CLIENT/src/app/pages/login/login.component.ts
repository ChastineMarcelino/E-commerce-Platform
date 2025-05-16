import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, MatSnackBarModule, CommonModule] // ✅ Import Snackbar Module
})
export class LoginComponent {

  credentials = { email: '', password: '' };
  isLoading = false; // ✅ Add Loading State
  errorMessage: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  // Show Snackbar message method
  showMessage(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.showMessage('⚠ Please enter both email and password.', 'Close', 3000);
      return;
    }

    this.isLoading = true; // ✅ Start Loading Indicator

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        this.isLoading = false; // ✅ Stop Loading
        this.errorMessage = '';

        if (res.user.status === 'Pending') {
          this.showMessage('⚠ Your account is pending approval. Please wait for admin approval.', 'Close', 3000);
          return;
        }

        this.showMessage('✅ Login successful!', 'Close', 3000);

        if (this.rememberMe) {
          localStorage.setItem('authToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
        } else {
          sessionStorage.setItem('authToken', res.accessToken);
          sessionStorage.setItem('refreshToken', res.refreshToken);
        } // ✅ Use 'authToken' instead of 'token'
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('adminAddress', res.user.address); 
        localStorage.setItem('userRole', res.user.role);

        // 🔹 Role-Based Navigation
      if (res.user.role === 'ADMIN') {
  // ✅ Always use localStorage for admin
  localStorage.setItem('authToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  localStorage.setItem('adminName', res.user.name); 
  this.router.navigate(['/admin-dashboard']);
}else {
  this.router.navigate(['/home']);
}
localStorage.setItem('email', res.user.email);


      },
      error: (err) => {
        this.isLoading = false; // ✅ Stop Loading on Error
        this.errorMessage = 'Incorrect email or password.';
      },
    });
  }
  
  clearError() {
    this.errorMessage = '';
}
}
