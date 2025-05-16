import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required], // ✅ Add current password
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    const { email, currentPassword, newPassword, confirmPassword } = this.forgotForm.value;

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }

    this.isLoading = true;

    // ✅ STEP 1: Verify current password (used in last 3 months)
    this.http.post(`${environment.apiUrl}/verify-old-password`, {
      email,
      oldPassword: currentPassword
    }).subscribe({
      next: () => {
        // ✅ STEP 2: If valid, request OTP for password reset
        this.http.post(`${environment.apiUrl}/forgot-password`, {
          email,
          newPassword,
          confirmPassword,
        }).subscribe({
          next: (res: any) => {
            alert(res.message || 'OTP sent to email');

            // Save info for OTP page
            localStorage.setItem('resetEmail', email);
            localStorage.setItem('otpSource', 'reset');

            this.router.navigate(['/verify-otp']);
          },
          error: (err) => {
            alert(err.error.message || 'Error sending OTP');
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        alert(err.error.message || 'Current password does not match last 3 months');
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
