import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service'; // adjust path if needed
import { CategoryService } from '../../services/category.service';



@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, FormsModule, MatSnackBarModule] // ✅ Import Snackbar
})
export class AdminDashboardComponent implements OnInit {
  currentTab: string = 'home'; // NEW: current tab state
  pendingUsers: any[] = [];
  staffMembers: any[] = [];
  roles = ['Staff', 'Manager', 'Admin'];
  isLoading = false;
  categories: any[] = [];
  newCategory: any;
  selectedInventoryItem: any = null;
  showEditInventoryPopup: boolean = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar,  private http: HttpClient, private authService: AuthService,  private router: Router,  private orderService: OrderService,   private categoryService: CategoryService) {}
  selectedStaff: any = null;
  showCategorySection = false;
  
  
  // Toggle panel
  toggleCategorySection() {
    this.showCategorySection = !this.showCategorySection;
  }
  
  // Load categories from backend
loadCategories() {
  this.categoryService.getCategories().subscribe({
    next: (res) => this.categories = res,
    error: () => this.showMessage('❌ Failed to load categories', 'error'),
  });
}
  
  // Add category
addCategory() {
  const trimmed = this.newCategory?.trim();
  if (!trimmed) {
    this.showMessage('⚠️ Please enter a valid category name.', 'error');
    return;
  }

  this.categoryService.addCategory(trimmed).subscribe({
    next: () => {
      this.showMessage('✅ Category added');
      this.newCategory = '';
      this.loadCategories();
    },
    error: (err) => {
      console.error('❌ Add failed:', err.error);
      this.showMessage('❌ Failed to add category', 'error');
    }
  });
}


  
  // Delete category
  deleteCategory(id: string) {
  if (!confirm('Delete this category?')) return;

  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.showMessage('✅ Category deleted');
      this.loadCategories();
    },
    error: () => this.showMessage('❌ Failed to delete category', 'error'),
  });
}
  
  openStaffPopup(staff: any) {
    this.selectedStaff = staff;
  }
  
  closeStaffPopup() {
    this.selectedStaff = null;
  }
  
  deleteStaff(id: string) {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
  
    this.adminService.deleteStaff(id).subscribe({
      next: () => {
        this.showMessage("✅ Staff member deleted successfully.", 'success');
        this.staffMembers = this.staffMembers.filter(member => member._id !== id);
        this.closeStaffPopup();
      },
      error: () => {
        this.showMessage("❌ Failed to delete staff member.", 'error');
      }
    });
  }
  
  ngOnInit(): void {
    this.loadPendingUsers();
    this.loadStaffMembers();
    console.log('🧪 Staff loaded:', this.staffMembers);

    this.loadAdminName(); 
    this.loadCategories();
    this.loadAllOrdersForAdmin();
    this.loadInventoryItems();
  }
   // ✅ NEW: Load name from localStorage
   adminName: string = 'Admin';
   adminAddress: string = '';

loadAdminName(): void {
  const storedName = localStorage.getItem('adminName');
  const role = localStorage.getItem('userRole');

  if (storedName && role === 'ADMIN') {
    this.adminName = storedName;
    const storedAddress: any = localStorage.getItem('adminAddress');
    this.adminAddress = storedAddress || ' ';
  } else {
    this.adminName = storedName || 'Admin'; // Fallback if staff logs in
    this.adminAddress = 'No Address';
  }
  console.log('adminName:', storedName);
console.log('userRole:', role);

}







openEditInventoryModal(item: any): void {
  this.selectedInventoryItem = { ...item }; // clone to prevent mutation
  this.showEditInventoryPopup = true;
}

// Close the modal
closeEditInventoryModal(): void {
  this.showEditInventoryPopup = false;
  this.selectedInventoryItem = null;
}

updateInventoryItem(): void {
  console.log('🧪 Updating item:', this.selectedInventoryItem);
console.log("🧪 Updating item:", this.selectedInventoryItem);
console.log("🧪 ID used in PUT:", this.selectedInventoryItem._id);

  if (!this.selectedInventoryItem?._id) {
    this.showMessage('❌ No valid ID found for update.', 'error');
    return;
  }

  const updatedData = {
 name: this.selectedInventoryItem.name?.trim(), // ✅ key name fixed
    category: this.selectedInventoryItem.category?.trim(),
    quantity: Number(this.selectedInventoryItem.quantity),
    unit: this.selectedInventoryItem.unit?.trim(),
    price: Number(this.selectedInventoryItem.price),
    reorderLevel: Number(this.selectedInventoryItem.reorderLevel),
    // optional
    supplier: this.selectedInventoryItem.supplier?.trim() || undefined
  };

  this.adminService.updateInventoryItem(this.selectedInventoryItem._id, updatedData)
    .subscribe({
      next: () => {
        this.showMessage('✅ Inventory item updated successfully.', 'success');
        this.loadInventoryItems();
        this.closeEditInventoryModal();
      },
      error: (err) => {
        console.error('❌ Update Error:', err);
        this.showMessage('❌ Failed to update item.', 'error');
      }
    });
}



deleteInventoryItem(id: string): void {
  if (!confirm('Are you sure you want to delete this inventory item?')) return;

  this.adminService.deleteInventoryItem(id).subscribe({
    next: () => {
      this.showMessage('✅ Inventory item deleted successfully.', 'success');
      this.loadInventoryItems(); // Refresh inventory list
    },
    error: () => {
      this.showMessage('❌ Failed to delete inventory item.', 'error');
    }
  });
}



deleteOrder(id: string): void {
  if (!confirm('Are you sure you want to delete this order?')) return;

  this.orderService.deleteOrder(id).subscribe({
    next: () => {
      this.showMessage('✅ Order deleted successfully.', 'success');
      this.loadAllOrdersForAdmin(); // Refresh the list
    },
    error: () => {
      this.showMessage('❌ Failed to delete the order.', 'error');
    }
  });
}


  loadPendingUsers() {
    this.isLoading = true;
    this.adminService.getPendingUsers().subscribe(
      users => {
        this.pendingUsers = users;
        this.isLoading = false;
      },
      error => {
        this.showMessage('❌ Error fetching users', 'error');
        this.isLoading = false;
      }
    );
  }

  loadStaffMembers() {
    this.adminService.getStaffMembers().subscribe(
      staff => {
        const currentUserEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
  
        // ✅ Sort: Logged-in user first, then online users
        this.staffMembers = staff.sort((a, b) => {
          if (a.email === currentUserEmail) return -1;
          if (b.email === currentUserEmail) return 1;
          return Number(b.isOnline) - Number(a.isOnline); // Then online first
        });
  
        console.log('Sorted staff list:', this.staffMembers);
      },
      error => {
        this.showMessage('❌ Error fetching staff members', 'error');
      }
    );
  }

  approveUser(user: any) {
    if (!user._id) {
      this.showMessage("❌ Error: Cannot approve user without an ID.", 'error');
      return;
    }

    if (!user.name || !user.role) {
      this.showMessage("⚠ Please enter a name and select a role before approving.", 'error');
      return;
    }

    this.isLoading = true;
    this.adminService.approveUser(user._id, user.name, user.role).subscribe({
      next: () => {
        this.showMessage(`${user.email} approved as ${user.role}`, 'success');
        this.loadPendingUsers();
        this.loadStaffMembers();
      },
      error: (err) => {
        this.showMessage(`❌ Approval failed: ${err.error?.message || "Unknown error"}`, 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  orders: any[] = []; // 🔴 This should be renamed if you're using 'allOrders' in HTML

loadAllOrdersForAdmin() {
  const role = localStorage.getItem('userRole');
  if (role === 'ADMIN') {
    this.orderService.getOrders().subscribe({
      next: (res: any[]) => {
        this.orders = res; // ✅ Fix here
        console.log("All Orders Loaded:", this.orders);
      },
      error: () => this.showMessage("❌ Failed to load orders", 'error'),
    });
  }
}

inventoryItems: any[] = [];

loadInventoryItems() {
  const adminId = localStorage.getItem('adminId') || ''; // Make sure adminId is stored in localStorage
  this.adminService.getInventoryItems(adminId).subscribe({
  next: (res: any[]) => {
    this.inventoryItems = res;
    console.log("📦 Inventory loaded:", this.inventoryItems);
  },
  error: () => this.showMessage("❌ Failed to load inventory", "error"),
});

}


  rejectUser(user: any) {
    if (!confirm(`Are you sure you want to reject ${user.email}?`)) return;

    this.isLoading = true;
    this.adminService.rejectUser(user?._id || user?.id).subscribe({
      next: () => {
        this.showMessage(`${user.email} has been rejected.`, 'success');
        this.pendingUsers = this.pendingUsers.filter(u => u._id !== user?._id);
      },
      error: (err) => {
        this.showMessage(`❌ Error rejecting user: ${err.error?.message || "Unknown error"}`, 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }
  
  isPopupVisible = false;

  showPopup() {
    this.isPopupVisible = true;
  }



  hidePopup() {
    this.isPopupVisible = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isPopupVisible) {
      this.hidePopup();
    }
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
} 




function subscribe(arg0: { next: () => void; error: () => void; }) {
  throw new Error('Function not implemented.');
}

