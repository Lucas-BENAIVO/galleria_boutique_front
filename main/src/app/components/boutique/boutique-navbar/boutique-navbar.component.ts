import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { BoutiqueService } from '../../../services/boutique.service';
import { SidebarService } from '../../../services/sidebar.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-boutique-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <nav class="boutique-navbar">
      <div class="navbar-left">
        <button class="mobile-menu-btn" (click)="toggleSidebar()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
      <div class="navbar-right">
        <button class="navbar-icon-btn">
          <span class="iconify" data-icon="solar:bell-bing-bold" style="font-size: 1.5em;"></span>
        </button>
        <div class="navbar-user">
          <span class="iconify" data-icon="solar:shop-bold" style="font-size: 1.5em; color: #888;"></span>
          <span class="navbar-username">{{ boutiqueName || 'Ma Boutique' }}</span>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./boutique-navbar.component.scss']
})
export class BoutiqueNavbarComponent implements OnInit {
  boutiqueName = '';

  constructor(
    private authService: AuthService,
    private boutiqueService: BoutiqueService,
    private sidebarService: SidebarService
  ) {}

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  ngOnInit() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (boutiqueId) {
      this.boutiqueService.getBoutiqueById(boutiqueId).subscribe({
        next: (res) => {
          this.boutiqueName = res.data?.name || 'Ma Boutique';
        },
        error: () => {
          this.boutiqueName = 'Ma Boutique';
        }
      });
    }
  }
}
