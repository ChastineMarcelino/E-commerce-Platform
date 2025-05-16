import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

export interface Order {
  [x: string]: any;
  _id: any;
  product: string;
  image: string;
  sugarLevel: string;
  size: string;
  quantity: number;
  addons: string[];
  status?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}`, orderData, { headers });
  }

  getOrders(): Observable<Order[]> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Order[]>(this.apiUrl, { headers });
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status }, { headers });
  }

  updateOrder(id: string, updated: Partial<Order>): Observable<Order> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Order>(`${this.apiUrl}/${id}`, updated, { headers });
  }
  getMyOrders(p0: string, p1: string): Observable<Order[]> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`, { headers });
  }
  getAdminOrders(): Observable<any[]> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`, { headers });
  }
  

  deleteOrder(id: string): Observable<any> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
