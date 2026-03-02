import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-commandes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes-list.component.html',
  styleUrls: ['./commandes-list.component.scss']
})
export class CommandesListComponent implements OnInit {
  showForm = false;
  editCommande: Order | null = null;
  selectedStatus = '';
  
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    public orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    const boutiqueId = this.authService.getBoutiqueId();
    
    if (boutiqueId) {
      this.orderService.getOrdersByBoutique(boutiqueId).subscribe({
        next: (response) => {
          if (response.success) {
            this.orders = response.data;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commandes';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Mode admin - charger toutes les commandes
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          if (response.success) {
            this.orders = response.data;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commandes';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  get filteredOrders(): Order[] {
    if (!this.selectedStatus) return this.orders;
    return this.orders.filter(o => {
      return o.paymentStatus === this.selectedStatus ||
             o.items.some(item => item.status === this.selectedStatus);
    });
  }

  get paginatedOrders(): Order[] {
    const filtered = this.filteredOrders;
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

  getClientName(order: Order): string {
    if (typeof order.userId === 'object') {
      return order.userId.fullName || 'Client';
    }
    return 'Client';
  }

  getClientEmail(order: Order): string {
    if (typeof order.userId === 'object') {
      return order.userId.email || '';
    }
    return '';
  }

  getOverallStatus(order: Order): string {
    // Retourner le statut le plus avancé des items ou le statut de paiement
    if (order.paymentStatus === 'CANCELLED') return 'CANCELLED';
    if (order.items.every(item => item.status === 'LIVRE')) return 'LIVRE';
    if (order.items.some(item => item.status === 'EN_COURS')) return 'EN_COURS';
    return 'PREPARATION';
  }

  openEditForm(order: Order) {
    this.editCommande = order;
    this.showForm = true;
  }

  openAddForm() {
    // Les commandes ne sont pas créées manuellement normalement
    this.editCommande = null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editCommande = null;
  }

  updateItemStatus(orderId: string, productId: string, newStatus: 'PREPARATION' | 'EN_COURS' | 'LIVRE') {
    this.orderService.updateItemStatus(orderId, productId, newStatus).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Erreur mise à jour statut:', err)
    });
  }

  onSaveCommande(data: any) {
    // Mise à jour du statut des items
    if (this.editCommande && data.itemUpdates) {
      data.itemUpdates.forEach((update: any) => {
        this.updateItemStatus(this.editCommande!._id, update.productId, update.status);
      });
    }
    this.closeForm();
  }
}