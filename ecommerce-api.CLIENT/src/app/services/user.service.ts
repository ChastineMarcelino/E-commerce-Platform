import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return throwError(() => new Error('No token found'));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get('http://localhost:3000/api/users/profile', { headers });
  }
}
