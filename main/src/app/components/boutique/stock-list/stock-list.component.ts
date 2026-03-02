import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockItem, StockTransaction, UpdateStockData } from '../../../services/stock.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  stocks: StockItem[] = [];
  transactions: StockTransaction[] = [];
  loading = false;
  loadingTransactions = false;
  error = '';
  editingStock: StockItem | null = null;
  editQuantity = 0;
  editThreshold = 5;
  editReason = '';
  filterStatus = '';
  activeTab: 'stocks' | 'transactions' = 'stocks';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private stockService: StockService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) {
      this.error = 'Boutique non trouvée';
      return;
    }

    this.loading = true;
    this.error = '';

    this.stockService.getStocksByBoutique(boutiqueId).subscribe({
      next: (res) => {
        this.stocks = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement stocks:', err);
        this.error = 'Erreur lors du chargement des stocks';
        this.loading = false;
      }
    });
  }

  loadTransactions() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) return;

    this.loadingTransactions = true;
    this.stockService.getStockTransactions(boutiqueId).subscribe({
      next: (res) => {
        this.transactions = res.data || [];
        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error('Erreur chargement transactions:', err);
        this.loadingTransactions = false;
      }
    });
  }

  switchTab(tab: 'stocks' | 'transactions') {
    this.activeTab = tab;
    if (tab === 'transactions' && this.transactions.length === 0) {
      this.loadTransactions();
    }
  }

  getStockStatus(stock: StockItem): string {
    if (stock.quantity === 0) return 'Rupture';
    if (stock.quantity <= stock.alertThreshold) return 'Faible';
    return 'OK';
  }

  getStatusClass(stock: StockItem): string {
    const status = this.getStockStatus(stock);
    if (status === 'Rupture') return 'rupture';
    if (status === 'Faible') return 'faible';
    return 'ok';
  }

  getTransactionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'ENTREE': 'Entrée',
      'SORTIE': 'Sortie',
      'AJUSTEMENT': 'Ajustement',
      'VENTE': 'Vente',
      'RETOUR': 'Retour'
    };
    return labels[type] || type;
  }

  getTransactionTypeClass(type: string): string {
    if (type === 'ENTREE' || type === 'RETOUR') return 'entree';
    if (type === 'SORTIE' || type === 'VENTE') return 'sortie';
    return 'ajustement';
  }

  get filteredStocks(): StockItem[] {
    if (!this.filterStatus) return this.stocks;
    return this.stocks.filter(s => this.getStockStatus(s) === this.filterStatus);
  }

  get paginatedStocks(): StockItem[] {
    const filtered = this.filteredStocks;
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

  openEditModal(stock: StockItem) {
    this.editingStock = stock;
    this.editQuantity = stock.quantity;
    this.editThreshold = stock.alertThreshold;
    this.editReason = '';
  }

  closeEditModal() {
    this.editingStock = null;
    this.editReason = '';
  }

  saveStock() {
    if (!this.editingStock) return;

    const data: UpdateStockData = {
      productId: this.editingStock.product._id,
      quantity: this.editQuantity,
      alertThreshold: this.editThreshold,
      reason: this.editReason
    };

    this.stockService.updateStock(data).subscribe({
      next: () => {
        this.loadStocks();
        if (this.activeTab === 'transactions') {
          this.loadTransactions();
        }
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Erreur mise à jour stock:', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  incrementStock(stock: StockItem, amount: number) {
    const data: UpdateStockData = {
      productId: stock.product._id,
      quantity: stock.quantity + amount,
      alertThreshold: stock.alertThreshold,
      type: amount > 0 ? 'ENTREE' : 'SORTIE',
      reason: 'Ajustement rapide'
    };

    this.stockService.updateStock(data).subscribe({
      next: () => {
        this.loadStocks();
        if (this.activeTab === 'transactions') {
          this.loadTransactions();
        }
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
}
