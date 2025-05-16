import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api/v1/inventory`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryItem[]> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<InventoryItem[]>(this.apiUrl, { headers });
  }

  addInventory(item: Partial<InventoryItem>): Observable<InventoryItem> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<InventoryItem>(this.apiUrl, item, { headers });
  }

  updateInventory(id: string, item: Partial<InventoryItem>): Observable<InventoryItem> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item, { headers });
  }

  deleteInventory(id: string): Observable<void> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
