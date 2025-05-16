import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment";

export interface Product {
  addOns: never[];
  inStock: number;
  category: string;
  image: any;
  imageUrl: any;
  grandePrice: any;
  medioPrice: any;
  id: string;
  name: string;
  price: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/api/v1/product`;

  constructor(private http: HttpClient) {}

  // 🔁 Shared headers helper (no 'Content-Type' so Angular handles FormData)
  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      console.error("❌ No auth token found!");
      return null;
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  // ✅ Get all products
  getProducts(): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return of([]);
    return this.http.get<Product[]>(this.apiUrl, { headers });
  }

  // ✅ Create new product using FormData (for image upload)
  createProduct(formData: FormData): Observable<Product> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();
    return this.http.post<Product>(this.apiUrl, formData, { headers }); // ✅ updated to use FormData
  }

  // ✅ Update product using FormData (for image upload)
  updateProduct(productId: string, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();
    return this.http.put<any>(`${this.apiUrl}/${productId}`, formData, { headers }); // ✅ updated to use FormData
  }
    getCategories(): Observable<string[]> {
  const headers = this.getAuthHeaders();
  if (!headers) return of([]);
  return this.http.get<string[]>(`${environment.apiUrl}/api/categories`, { headers });
}

  // ✅ Delete product
  deleteProduct(productId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers });
  }
}
