import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  products: Product[] = [];
  searchQuery: string = '';
  showProfilePage: boolean = false;
  openMenuId: string | null = null;
  dropdownOpen: string | null = null;
  selectedOrder: Order | null = null;
  showEditModal: boolean = false;
  menuOpenId: string | null = null;
  availableAddOns: string[] = ['Nata de coco', 'Bobba pearl', 'Sago pearls', 'Tapioca Pearls'];
  selectedOrderSugarLevel: string | undefined;
  // Removed duplicate declaration of showProfilePage
  userName!: string;
  userEmail!: string;
  userAddress!: string; // or userContact

  constructor(private orderService: OrderService, private productService: ProductsService, private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchMyOrders();
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
  fetchMyOrders(): void {
  this.orderService.getMyOrders('defaultOrderId', 'defaultStatus').subscribe({
    next: (data) => {
      this.orders = data.reverse(); // show latest orders first
      this.filteredOrders = this.orders;
    },
    error: (err) => {
      console.error('❌ Failed to fetch my orders:', err);
    }
  });
}

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('❌ Failed to fetch products:', err);
      }
    });
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.reverse();
        this.filteredOrders = this.orders;
      },
      error: (err) => {
        console.error('❌ Failed to fetch orders:', err);
      }
    });
  }

  filterOrders(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.product.toLowerCase().includes(query)
    );
  }

  getAmountSizeLabel(order: Order): string {
    const sizeMap: { [key: string]: string } = {
      '16oz': 'Medio',
      '22oz': 'Grande'
    };
    const sizeLabel = sizeMap[order.size] || order.size;
    return `${order.quantity} ${sizeLabel}`;
  }

  getAddOns(order: Order): string {
    return order['addOns'] && order['addOns'].length > 0 ? order['addOns'].join(', ') : '-';
  }

  getPrice(order: Order): number {
    const matchedProduct = this.products.find(
      p => p.name.toLowerCase().trim() === order.product.toLowerCase().trim()
    );

    if (!matchedProduct) return 0;

    const basePrice = order.size === '16oz' ? matchedProduct.medioPrice : matchedProduct.grandePrice;
    return basePrice * order.quantity;
  }

  showProfile() {
    this.showProfilePage = true;
  }

  close() {
    this.showProfilePage = false;
  }

  updateProfile() {
    this.showProfilePage = false;
  }

  toggleMenu(orderId: string) {
    this.menuOpenId = this.menuOpenId === orderId ? null : orderId;
  }

  openEditModal(order: Order): void {
    this.selectedOrder = JSON.parse(JSON.stringify(order)); // clone to avoid direct mutation

    if (this.selectedOrder) {
      this.selectedOrder['addOns'] = this.selectedOrder['addOns'] || [];
      this.selectedOrder.sugarLevel = this.selectedOrder.sugarLevel || '100%';
      this.selectedOrder.status = this.selectedOrder.status || 'Pending';
    }

    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.selectedOrder = null;
    this.showEditModal = false;
  }

  deleteOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      this.fetchMyOrders();
    });
  }

  toggleOrderStatus(order: any): void {
    const newStatus = order.status === 'Done' ? 'Pending' : 'Done';
    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
      },
      error: (err) => {
        console.error('Status update failed:', err);
      }
    });
  }

  toggleAddOn(addOn: string): void {
    if (!this.selectedOrder) return;

    if (!this.selectedOrder['addOns']) {
      this.selectedOrder['addOns'] = [];
    }

    const index = this.selectedOrder['addOns'].indexOf(addOn);
    if (index > -1) {
      this.selectedOrder['addOns'].splice(index, 1);
    } else {
      this.selectedOrder['addOns'].push(addOn);
    }
  }

  saveOrderChanges(): void {
    if (!this.selectedOrder) return;

    const updatedOrder = {
      product: this.selectedOrder.product,
      image: this.selectedOrder.image,
      quantity: this.selectedOrder.quantity,
      size: this.selectedOrder.size,
      sugarLevel: this.selectedOrder.sugarLevel || this.selectedOrderSugarLevel,
      addOns: this.selectedOrder['addOns'] || [],
      status: this.selectedOrder.status,
      updatedAt: new Date()
    };

    console.log('📦 Sending updated order:', updatedOrder);

    this.orderService.updateOrder(this.selectedOrder._id, updatedOrder).subscribe({
      next: () => {
        this.closeEditModal();
        this.fetchMyOrders();
      },
      error: (err) => {
        console.error('❌ Failed to update order:', err);
        alert('Update failed. Please double-check your values.');
      }
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
