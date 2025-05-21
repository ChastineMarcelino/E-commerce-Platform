import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [
    CommonModule, FormsModule,
    MatSnackBarModule, MatDialogModule, MatButtonModule
  ],
})
export class ProductsComponent implements OnInit {
  orderCart: any[] = [];
    showProfilePage = false;
    userName!: string;
    userEmail!: string;
    userAddress!: string; // or userContact
  
 
  
    removeAllFromCart() {
      if (this.orderCart.length > 0) {
        const confirmClear = confirm('Are you sure you want to remove all items from the cart?');
        if (confirmClear) {
          this.orderCart = [];
          this.snackBar.open('🗑 All items removed from cart.', 'Close', { duration: 3000 });
        }
      }
    }
    

  
  placeAllOrders() {
    if (!this.orderCart.length) return;
  
    let successCount = 0;
    const totalOrders = this.orderCart.length;
  
    this.orderCart.forEach((item, index) => {
      const newOrder = {
        product: item.product.name,
        image: item.product.imageUrl || item.product.image,
        sugarLevel: item.sugarLevel,
        size: item.size,
        quantity: item.quantity,
        addOns: item.addOns,
        status: 'Pending',
        date: new Date().toISOString()
      };
  
      this.orderService.placeOrder(newOrder).subscribe({
        next: () => {
          successCount++;
          if (successCount === totalOrders) {
            this.snackBar.open('✅ All orders placed!', 'Close', { duration: 3000 });
            this.orderCart = []; // Clear cart after placing all
          }
        },
        error: (err) => {
          console.error(`❌ Error placing order:`, err);
          this.snackBar.open('❌ Some orders failed.', 'Close', { duration: 3000 });
        }
      });
    });
  }

  placeSingleOrder(item: any, index: number) {
    const newOrder = {
      product: item.product.name,
      image: item.product.imageUrl || item.product.image,
      sugarLevel: item.sugarLevel,
      size: item.size,
      quantity: item.quantity,
      addOns: item.addOns,
      status: 'Pending',
      date: new Date().toISOString()
    };
  
    this.orderService.placeOrder(newOrder).subscribe({
      next: () => {
        this.snackBar.open('✅ Order placed!', 'Close', { duration: 3000 });
        this.removeFromCart(index); // Remove the item after placing
      },
      error: (err) => {
        console.error('❌ Order error:', err);
        this.snackBar.open('❌ Failed to place order.', 'Close', { duration: 3000 });
      }
    });
  }
  removeFromCart(index: number) {
    this.orderCart.splice(index, 1);
  }
  getCartTotal(): number {
    return this.orderCart.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  }
  
  showCartSidebar: boolean = false;


closeCartSidebar() {
  this.showCartSidebar = false;
}




  // Removed duplicate declaration of showProfilePage
showProfile() {
  this.showProfilePage = true;
  console.log('Profile icon clicked. showProfilePage:', this.showProfilePage); // Debugging
}
updateProfile() {
  this.showProfilePage = false;
}

close() {
  this.showProfilePage = false;
}
  isEditMode: boolean = false;
  selectedProduct: Product | null = null;
    selectedImage: File | null = null; // ✅ Added: holds selected image
  imagePreview: any; // ✅ Added: stores preview data URL

  newProduct = {
    name: '',
    medioPrice: 0,
    grandePrice: 0,
    description: '',
    category: 'Milktea',
    inStock: 0,
    imageUrl: '', 
    addOns: [] as string[]
  };

  isModalVisible: boolean = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  leftArrowVisible: boolean = false;
  rightArrowVisible: boolean = true;

  constructor(
    private productService: ProductsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private orderService: OrderService, private authService: AuthService, private router: Router, private userService: UserService,  private http: HttpClient
  ) {}
categories: any[] = [];
  ngOnInit() {
    this.selectedCategory = '';
    this.fetchProducts();
    this.fetchCategories();
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
  
  
  ngAfterViewInit() {
    if (this.carousel) {
      this.carousel.nativeElement.addEventListener('scroll', () => {
        const el = this.carousel.nativeElement;
        this.leftArrowVisible = el.scrollLeft > 0;
        this.rightArrowVisible = el.scrollWidth - el.scrollLeft > el.clientWidth;
      });
    }
  }
fetchCategories() {
  this.productService.getCategories().subscribe({
    next: (data) => {
      this.categories = data;
    },
    error: (err) => {
      console.error('❌ Failed to load categories:', err);
    }
  });
}
 fetchProducts() {
  this.productService.getProducts().subscribe((data: any[]) => {
    const products = data.map(product => ({
      ...product,
      id: product._id,
      imageUrl: product.imageUrl.startsWith('http')
        ? product.imageUrl
        : `https://e-commerce-platform-2-nybj.onrender.com/${product.imageUrl}`
    }));
    this.products = products;
    this.filterByCategory(this.selectedCategory);
  });
}


  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredProducts = category
      ? this.products.filter(product => product.category?.toLowerCase() === category.toLowerCase())
      : this.products;
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleAddProduct(product: Product | null = null) {
    this.isModalVisible = !this.isModalVisible;
    this.isEditMode = !!product;

    if (product) {
      this.selectedProduct = product;
      this.newProduct = {
        name: product.name,
        medioPrice: product.medioPrice,
        grandePrice: product.grandePrice,
        description: product.description || '',
        category: product.category || 'Milktea',
        inStock: product.inStock || 0,
        imageUrl: product.imageUrl || '',
        addOns: product.addOns || [] // ✅ Ensure imageUrl is included
      };
      this.imagePreview = product.imageUrl || null; // ✅ Show image in preview when editing
      this.selectedImage = null; // ✅ Reset selected image
    } else {
      this.resetForm();
    }
  }

  editProduct(product: Product) {
    this.toggleAddProduct(product); // ✅ Just call toggleAddProduct to handle form setup
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description || '');
    formData.append('medioPrice', this.newProduct.medioPrice.toString());
    formData.append('grandePrice', this.newProduct.grandePrice.toString());
    formData.append('inStock', this.newProduct.inStock.toString());
    formData.append('category', this.newProduct.category);
    formData.append('addOns', JSON.stringify(this.newProduct.addOns)); 
    if (this.selectedImage) formData.append('image', this.selectedImage); // ✅ Attach image if any

    const req = this.isEditMode && this.selectedProduct?.id
      ? this.productService.updateProduct(this.selectedProduct.id, formData)
      : this.productService.createProduct(formData);

    req.subscribe({
      next: () => {
        this.fetchProducts();
        this.snackBar.open(this.isEditMode ? '✅ Product updated!' : '✅ Product added!', 'Close', { duration: 3000 });
        this.isModalVisible = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.snackBar.open('❌ Operation failed', 'Close', { duration: 3000 });
      }
    });
  }

  resetForm() {
    this.newProduct = {
      name: '',
      medioPrice: 0,
      grandePrice: 0,
      description: '',
      category: 'Milktea',
      inStock: 0,
      imageUrl: '',
      addOns: [] // ✅ Reset addOns // ✅ Added missing property with default value
    };
    this.selectedProduct = null;
    this.isEditMode = false;
    this.selectedImage = null;
    this.imagePreview = null;
  }

  deleteProduct(productId: string | undefined): void {
    if (!productId) {
      this.snackBar.open('⚠️ Product ID missing.', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { title: 'Delete Product', message: 'Are you sure?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.snackBar.open('✅ Product deleted.', 'Close', { duration: 3000 });
            this.fetchProducts();
          },
          error: (err) => {
            console.error('❌ Delete error:', err);
            this.snackBar.open('❌ Delete failed.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // 🧋 ORDER MODAL LOGIC (unchanged)
  selectedProductForOrder: Product | null = null;
  sugarLevels: string[] = ['25%', '50%', '75%', '100%'];
  selectedSugar: string = '100%';
  sizes: string[] = ['16oz', '22oz'];
  selectedSize: string = '16oz';
  quantity: number = 1;
  addOns: string[] = ['Nata de coco', 'Bobba pearl', 'Sago pearls', 'Tapioca Pearls'];
  selectedAddOns: string[] = [];

  openOrderModal(product: Product) {
    this.selectedProductForOrder = product;
    this.selectedSugar = '100%';
    this.selectedSize = '16oz';
    this.quantity = 1;
    this.selectedAddOns = [];
  }

  closeOrderModal() {
    this.selectedProductForOrder = null;
  }

  selectSugar(level: string) {
    this.selectedSugar = level;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  toggleAddon(addon: string, event: any) {
    if (event.target.checked) {
      this.selectedAddOns.push(addon);
    } else {
      this.selectedAddOns = this.selectedAddOns.filter(a => a !== addon);
    }
  }

  placeOrder() {
    if (!this.selectedProductForOrder) return;
  
    const price = this.selectedSize === '16oz'
      ? this.selectedProductForOrder.medioPrice
      : this.selectedProductForOrder.grandePrice;
  
    // Push to sidebar cart
    this.orderCart.push({
      product: this.selectedProductForOrder,
      sugarLevel: this.selectedSugar,
      size: this.selectedSize,
      quantity: this.quantity,
      addOns: [...this.selectedAddOns],
      unitPrice: price
    });
 
    this.showCartSidebar = true; // 🔥 This line is necessary
    this.snackBar.open('🛒 Added to cart!', 'Close', { duration: 2000 });
    this.closeOrderModal();
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
