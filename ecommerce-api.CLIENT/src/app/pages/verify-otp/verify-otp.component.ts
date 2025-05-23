import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';  // ✅ use base API URL

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
  imports: [FormsModule, MatSnackBarModule, MatIconModule, CommonModule]
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otp: string = '';
  email: string = '';
  source: 'register' | 'reset' = 'register';
  minutes: number = 5;
  seconds: number = 0;
  resendDisabled: boolean = false;
  resendCountdown: number = 30;
  resendInterval: any;
  isVerifying: boolean = false;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('resetEmail') || '';
    });
    this.source = localStorage.getItem('otpSource') === 'reset' ? 'reset' : 'register';
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearInterval(this.resendInterval);
  }

  showMessage(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(
      type === 'success' ? `✔️ ${message}` : message,
      'Close',
      {
        duration: 3000,
        panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
        verticalPosition: 'top',
        horizontalPosition: 'center',
      }
    );
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.minutes === 0 && this.seconds === 0) {
        clearInterval(this.timer);
        this.showMessage('OTP expired! Please request a new OTP.', 'error');
      } else {
        if (this.seconds === 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.seconds--;
        }
      }
    }, 1000);
  }

  verifyOTP() {
    this.isVerifying = true;

    const url =
      this.source === 'reset'
        ? `${environment.apiUrl}/api/users/verify-forgot-password-otp`
        : `${environment.apiUrl}/verify-otp`;

    this.http.post(url, {
      email: this.email,
      otp: this.otp
    }).subscribe({
      next: (res: any) => {
        this.showMessage(res.message, 'success');

        // ✅ Clear stored flags
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('otpSource');

     // ✅ Redirect based on OTP source
     if (this.source === 'reset' && res.accessToken) {
   localStorage.setItem('authToken', res.accessToken);
      this.router.navigate(['/home']);
       return; // ✅ STOP here to avoid falling to login
    } 
      this.router.navigate(['/login']);
    
  },
  error: (err) => {
    this.showMessage(err.error.message || 'Invalid OTP', 'error');
    this.isVerifying = false;
  }
});
}

  resendOTP() {
    if (this.resendDisabled) return;

    this.resendDisabled = true;
    this.resendCountdown = 30;

    this.http.post(`${environment.apiUrl}/resend-otp`, { email: this.email }).subscribe({
      next: () => {
        this.showMessage('OTP resent successfully.', 'success');
        this.restartOtpTimer();
        this.startResendCooldown();
      },
      error: (err) => {
        this.showMessage(err.error.message || 'Failed to resend OTP.', 'error');
        this.resendDisabled = false;
        clearInterval(this.resendInterval);
      }
    });
  }

  restartOtpTimer() {
    clearInterval(this.timer);
    this.minutes = 5;
    this.seconds = 0;
    this.startTimer();
  }

  startResendCooldown() {
    clearInterval(this.resendInterval);
    this.resendCountdown = 30;

    this.resendInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown === 0) {
        clearInterval(this.resendInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
