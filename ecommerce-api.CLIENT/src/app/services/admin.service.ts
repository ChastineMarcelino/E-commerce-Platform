import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  
  deleteInventoryItem(id: string) {
    const token = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.delete(`${environment.apiUrl}/api/v1/inventory/${id}`, { headers });
  }
  
updateInventoryItem(id: string, data: any): Observable<any> {
  const token = localStorage.getItem('authToken'); // ✅ Get token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const url = `${environment.apiUrl}/api/v1/inventory/${id}`;
  return this.http.put(url, data, { headers }); // ✅ Send with headers
}


  private apiUrl = environment.apiUrl + '/api/users'; // Ensure API URL is correct

  constructor(private http: HttpClient) {}

  // Fetch pending users
  getPendingUsers(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("❌ No auth token found in localStorage!");
      return new Observable(); // Return empty observable to avoid API call
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/pending`, { headers });
  }
// Fetch staff members from backend
getStaffMembers(): Observable<any[]> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any[]>(`${environment.apiUrl}/api/staff-members`, { headers });
}
approveUser(userId: string, name: string, role: string): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  const body = { name, role }; // ✅ Ensure this matches backend expectations

  console.log("🔹 Sending approve request:", { userId, body }); // ✅ Debugging

  // ✅ FIXED: Remove extra `/users/` since `apiUrl` already includes it
  return this.http.put(`${this.apiUrl}/${userId}/approve`, { name, role }, { headers });
}


  // Reject a user
  rejectUser(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${userId}/reject`, { headers });

  }
  getInventoryItems(id: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<any[]>(`${environment.apiUrl}/api/v1/inventory`, { headers });
  }
  
  
  deleteStaff(id: string) {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.delete(`${this.apiUrl}/staff/${id}`, { headers });
  }
  
  
  
}


