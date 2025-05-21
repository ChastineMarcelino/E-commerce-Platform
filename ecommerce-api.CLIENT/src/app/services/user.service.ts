import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: any;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return throwError(() => new Error('No token found'));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get(`${this.apiUrl}/api/users/profile`, { headers });

  }
}
