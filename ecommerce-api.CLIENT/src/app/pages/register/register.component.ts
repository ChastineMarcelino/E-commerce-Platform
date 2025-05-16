import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule, MatSnackBarModule, NgxSpinnerModule] // ✅ Import Snackbar Module
})
export class RegisterComponent {

  isLoading: boolean = false;

  

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: ''
  };
  authService: any;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private spinner: NgxSpinnerService) {}

  showMessage(message: string, action: string = 'OK', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'bottom', // Can be 'bottom' as well
      horizontalPosition: 'center', // Can be 'start' | 'end' | 'left' | 'right'
    });
  }

  register() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.user.address) {
      this.showMessage('All fields are required!', 'Close', 3000);
      return;
    }
    this.spinner.show();
    this.isLoading = true;
    const userDataToSend = {
      name: `${this.user.firstName} ${this.user.lastName}`,
      email: this.user.email,
      password: this.user.password,
      address: this.user.address
    };
  
    this.http.post(`${environment.apiUrl}/register`, userDataToSend).subscribe({
      next: (res: any) => {
        this.isLoading = false; // ✅ Stop loading
  
        localStorage.setItem('adminName', `${this.user.firstName} ${this.user.lastName}`);
        localStorage.setItem('resetEmail', this.user.email);
        localStorage.setItem('otpSource', 'register');
  
        this.showMessage(res.message, 'Close', 3000);
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.user.email } });
      },
      error: (err) => {
        this.isLoading = false; // ❌ Stop loading on error
        this.showMessage(err.error.message || 'Registration failed', 'Close', 3000);
      }
    });
  }
  userData(userData: any) {
    throw new Error('Method not implemented.');
  }
  
}
