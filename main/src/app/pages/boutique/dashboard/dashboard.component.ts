import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/boutique/sidebar/sidebar.component';
import { BoutiqueNavbarComponent } from '../../../components/boutique/boutique-navbar/boutique-navbar.component';
import { FooterComponent } from '../../../components/boutique/footer/footer.component';
import { StatCardComponent } from '../../../components/boutique/stat-card/stat-card.component';
import { TopProduitsComponent } from '../../../components/boutique/top-produits/top-produits.component';
import { VentesParJourComponent } from '../../../components/boutique/ventes-par-jour/ventes-par-jour.component';
import { TopClientsComponent } from '../../../components/boutique/top-clients/top-clients.component';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, BoutiqueNavbarComponent, FooterComponent, StatCardComponent, TopProduitsComponent, VentesParJourComponent, TopClientsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  isLoading = true;
  
  totalRevenue = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const boutiqueId = this.authService.getBoutiqueId();

    if (boutiqueId) {
      this.productService.getProductsByBoutique(boutiqueId).subscribe({
        next: (response) => {
          if (response.success) {
            this.totalProducts = response.data.length;
            this.updateStatsDisplay();
          }
        }
      });

      this.orderService.getOrdersByBoutique(boutiqueId).subscribe({
        next: (response) => {
          if (response.success) {
            this.totalOrders = response.data.length;
            this.pendingOrders = response.data.filter(o => o.paymentStatus === 'PENDING').length;
            this.totalRevenue = response.data
              .filter(o => o.paymentStatus !== 'CANCELLED')
              .reduce((sum, o) => sum + o.totalAmount, 0);
            this.updateStatsDisplay();
          }
          this.isLoading = false;
        }
      });
    } else {
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          if (response.success) {
            this.totalProducts = response.data.length;
            this.updateStatsDisplay();
          }
        }
      });

      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          if (response.success) {
            this.totalOrders = response.data.length;
            this.pendingOrders = response.data.filter(o => o.paymentStatus === 'PENDING').length;
            this.totalRevenue = response.data
              .filter(o => o.paymentStatus !== 'CANCELLED')
              .reduce((sum, o) => sum + o.totalAmount, 0);
            this.updateStatsDisplay();
          }
          this.isLoading = false;
        }
      });
    }
  }

  updateStatsDisplay() {
    this.stats = [
      {
        icon: 'payments',
        iconColor: '#5d87ff',
        label: 'Revenu total',
        value: this.formatNumber(this.totalRevenue) + ' Ar',
        changeType: 'positive' as const
      },
      {
        icon: 'shopping_bag',
        iconColor: '#ffc107',
        label: 'Commandes totales',
        value: this.totalOrders.toString(),
        actionLabel: this.pendingOrders + ' en attente',
        actionColor: '#ffc107',
        changeType: 'neutral' as const
      },
      {
        icon: 'inventory_2',
        iconColor: '#13deb9',
        label: 'Produits listés',
        value: this.totalProducts.toString(),
        changeType: 'positive' as const
      },
      {
        icon: 'star',
        iconColor: '#ff5ca8',
        label: 'Note moyenne',
        value: '4.8',
        change: '+0.3',
        changeType: 'positive' as const,
        changeIcon: 'trending_up'
      }
    ];
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
