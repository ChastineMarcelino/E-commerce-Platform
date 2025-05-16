import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showProfilePage = false;

  userName!: string;
  userEmail!: string;
  userAddress!: string;
  userImageUrl: string = 'assets/icon.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserProfile(); // ✅ Fetch profile when homepage loads
  }

  showProfile() {
    this.showProfilePage = true;
    console.log('Profile icon clicked. showProfilePage:', this.showProfilePage);
  }

  close() {
    this.showProfilePage = false;
  }

  updateProfile() {
    this.showProfilePage = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.router.navigate(['/login']); // still redirect user even on failure
      }
    });
  }
  

  // ✅ NEW: Fetch user profile from backend
  loadUserProfile(): void {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>('http://localhost:3000/api/users/profile', { headers })
    .subscribe({
      next: user => {
        this.userName = user.fullName;
        this.userEmail = user.email;
        this.userAddress = user.address;
        this.userImageUrl = user.profileImageUrl || 'assets/icon.png';
      },
      error: err => {
        console.error('❌ Failed to load user profile:', err);
      }
    });
  }
   // ✅ Handle image upload on input change
   uploadProfileImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return;

    const formData = new FormData();
    formData.append('image', file);

    this.http.put<any>('http://localhost:3000/api/users/profile/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: res => {
        this.userImageUrl = res.imageUrl;
      },
      error: err => {
        console.error('❌ Upload failed:', err);
      }
    });
  }
}

