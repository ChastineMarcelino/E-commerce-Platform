import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment'; // ✅ Import environment
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 getUserRole(): string | null {
  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return user.role || null;
  } catch {
    return null;
  }
}


  private apiUrl = environment.apiUrl; // ✅ Set API URL dynamically
  router: any;

  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  verifyOtp(otpData: any) {
    return this.http.post(`${this.apiUrl}/verify-otp`, otpData);
  }
 // ✅ Resend OTP method
 resendOtp(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/resend-otp`, { email });
}
  // ✅ Save token in localStorage after login
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Login failed.'));
      })
    );
  }
  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, { token: refreshToken }).pipe(
      tap(response => {
        if (response.accessToken) {
          const usedStorage = sessionStorage.getItem('refreshToken') ? sessionStorage : localStorage;
          usedStorage.setItem('authToken', response.accessToken);
        }
      }),
      
      catchError(() => {
        this.logout(); // logout on failed refresh
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }
  getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  
  // ✅ Logout function to remove token
  logout(): Observable<any> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        localStorage.clear();
        sessionStorage.clear();
      })
    );
  }
  
  
  
  
  // ✅ NEW: Forgot password (send OTP)
  forgotPassword(data: { email: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/forgot-password`, data);
  }

  // ✅ NEW: Verify OTP and reset password
  verifyForgotPasswordOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-forgot-password-otp`, data);
  }
}

