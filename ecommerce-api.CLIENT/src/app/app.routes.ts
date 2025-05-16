import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ErrorComponent } from './pages/error/error.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // ✅ Define homepage route
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'verify-otp', component: VerifyOtpComponent },
 { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },  
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] }, 
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'error/:code', component: ErrorComponent }, // Reusable error page
  { path: '**', redirectTo: '/error/404' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
