import { Component, OnInit } from '@angular/core';
import { ProduitsFormComponent } from '../produits-form/produits-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-produits-list',
  standalone: true,
  templateUrl: './produits-list.component.html',
  styleUrls: ['./produits-list.component.scss'],
  imports: [CommonModule, FormsModule, ProduitsFormComponent]
})
export class ProduitsListComponent implements OnInit {
  showForm = false;
  editProduct: Product | null = null;
  
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading = true;
    const boutiqueId = this.authService.getBoutiqueId();
    
    if (boutiqueId) {
      this.productService.getProductsByBoutique(boutiqueId).subscribe({
        next: (response) => {
          if (response.success) {
            this.products = response.data;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des produits';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Si pas de boutiqueId, charger tous les produits (mode admin)
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          if (response.success) {
            this.products = response.data;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des produits';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (err) => console.error('Erreur catégories:', err)
    });
  }

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) return this.products;
    return this.products.filter(p => p.categoryId === this.selectedCategory);
  }

  get paginatedProducts(): Product[] {
    const filtered = this.filteredProducts;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  openAddForm() {
    this.editProduct = null;
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.editProduct = product;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editProduct = null;
  }

  onSaveProduct(productData: any) {
    const boutiqueId = this.authService.getBoutiqueId();
    
    if (!boutiqueId) {
      this.errorMessage = 'Erreur: boutiqueId manquant. Veuillez vous reconnecter.';
      console.error('boutiqueId manquant - user:', this.authService.getCurrentUser());
      return;
    }
    
    if (this.editProduct) {
      // Mise à jour
      this.productService.updateProduct(this.editProduct._id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour';
          console.error('Erreur mise à jour:', err);
        }
      });
    } else {
      // Création
      const newProduct = {
        ...productData,
        boutiqueId: boutiqueId
      };
      console.log('Creating product:', newProduct);
      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création';
          console.error('Erreur création:', err);
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Supprimer le produit "${product.name}" ?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '-';
    const category = this.categories.find(c => c._id === categoryId);
    return category?.name || '-';
  }
}
