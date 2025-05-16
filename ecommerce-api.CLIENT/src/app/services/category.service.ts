import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  getCategories() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

addCategory(categoryName: string): Observable<any> {
  return this.http.post(this.apiUrl, { categoryName }, { headers: this.getAuthHeaders() });
}


  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
