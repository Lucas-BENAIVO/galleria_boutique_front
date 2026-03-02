import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { SidebarService } from '../../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private sidebarSub!: Subscription;
  
  menuItems = [
    {
      icon: 'home',
      label: 'Tableau de bord',
      route: '/boutique/dashboard',
      active: true
    },
    {
      icon: 'inventory_2',
      label: 'Produits',
      route: '/boutique/produits',
      active: false
    },
    {
      icon: 'shopping_cart',
      label: 'Commandes',
      route: '/boutique/commandes',
      active: false
    },
    {
      icon: 'local_offer',
      label: 'Promotions',
      route: '/boutique/promotions',
      active: false
    }
  ];

  accountItems = [
    {
      icon: 'warehouse',
      label: 'Gestion de stock',
      route: '/boutique/stock',
      active: false
    }
  ];

  settingsItems = [
    {
      icon: 'storefront',
      label: 'Ma Boutique',  
      route: '/boutique/profile',
      active: false
    },
    {
      icon: 'logout',
      label: 'Déconnexion',
      route: '/authentication/login',
      active: false
    }
  ];

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  toggleExpand(item: any): void {
    item.expanded = !item.expanded;
  }

  setActive(item: any): void {
    this.resetActive();
    item.active = true;
    // Close sidebar on mobile when clicking a menu item
    this.sidebarService.close();
  }

  resetActive(): void {
    this.menuItems.forEach((m: any) => m.active = false);
    this.accountItems.forEach((m: any) => m.active = false);
    this.settingsItems.forEach((m: any) => m.active = false);
  }

  closeSidebar(): void {
    this.sidebarService.close();
  }

  ngOnInit(): void {
    // Subscribe to sidebar state
    this.sidebarSub = this.sidebarService.isOpen$.subscribe(open => {
      this.isOpen = open;
    });
    
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveByRoute(event.urlAfterRedirects);
        // Close sidebar on navigation
        this.sidebarService.close();
      }
    });
    // Initial activation
    this.updateActiveByRoute(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.sidebarSub) {
      this.sidebarSub.unsubscribe();
    }
  }

  updateActiveByRoute(url: string): void {
    this.resetActive();
    // Menu principal
    this.menuItems.forEach((item: any) => {
      if (url.startsWith(item.route)) {
        item.active = true;
      }
    });
    // Gestion de stock
    this.accountItems.forEach((item: any) => {
      if (url.startsWith(item.route)) {
        item.active = true;
      }
      if (item.subItems) {
        item.subItems.forEach((sub: any) => {
          if (url.startsWith(sub.route)) {
            item.active = true;
            item.expanded = true;
          }
        });
      }
    });
    // Paramètres
    this.settingsItems.forEach((item: any) => {
      if (url.startsWith(item.route)) {
        item.active = true;
      }
    });
  }
}
