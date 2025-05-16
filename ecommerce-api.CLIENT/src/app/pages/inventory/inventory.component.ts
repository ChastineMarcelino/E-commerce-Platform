import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  searchText = '';
  inventoryList: InventoryItem[] = [];
  filteredList: InventoryItem[] = [];
  showAddModal = false;
  showEditModal = false;
  showProfilePage = false;
  selectedActionId: string | null = null;
  editableItem: InventoryItem | null = null;

  userName!: string;
  userEmail!: string;
  userAddress!: string;

  

  newItem: Partial<InventoryItem> = {
    name: '', quantity: 0, unit: '',
    price: 0, category: '', reorderLevel: 0
  };

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.fetchInventory();
    this.userService.getProfile().subscribe({
      next: (user: { fullName: string; email: string; address: string; }) => {
        this.userName = user.fullName;
        this.userEmail = user.email;
        this.userAddress = user.address;
      },
      error: (err: any) => {
        console.error('❌ Failed to load user profile:', err);
      }
    });
  }


  fetchInventory(): void {
    this.inventoryService.getInventory().subscribe((data: InventoryItem[]) => {
      this.inventoryList = data;
      this.filteredList = data;
    });
  }

  onSearch(): void {
    this.filteredList = this.inventoryList.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  toggleActionMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedActionId = this.selectedActionId === id ? null : id;
  }

  @HostListener('document:click')
  closeActionMenu(): void {
    this.selectedActionId = null;
  }

  openAddModal(): void {
    this.newItem = {};
    this.showAddModal = true;
  }

  saveNewItem(): void {
    this.inventoryService.addInventory(this.newItem).subscribe(() => {
      this.fetchInventory();
      this.closeModals();
    });
  }

  updateProfile(): void {
    this.showProfilePage = false;
  }

  openEditModal(item: InventoryItem | null): void {
    this.editableItem = item;
    this.showEditModal = true;
  }

  closeEditModal(item: InventoryItem | null): void {
    this.showEditModal = false;
  }

  deleteItem(id: string): void {
   this.inventoryService.deleteInventory(id).subscribe({
        next: () => {
          this.fetchInventory();
          this.snackBar.open('✅ Inventory item deleted!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: () => {
          this.snackBar.open('❌ Failed to delete item.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });}
  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.editableItem = null;
  }

  showProfile(): void {
    this.showProfilePage = true;
  }

  close(): void {
    this.showProfilePage = false;
    this.closeModals();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
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
