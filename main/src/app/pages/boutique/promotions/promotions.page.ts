import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsListComponent } from '../../../components/boutique/promotions-list/promotions-list.component';
import { SidebarComponent } from '../../../components/boutique/sidebar/sidebar.component';
import { BoutiqueNavbarComponent } from '../../../components/boutique/boutique-navbar/boutique-navbar.component';
import { FooterComponent } from '../../../components/boutique/footer/footer.component';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [CommonModule, PromotionsListComponent, SidebarComponent, BoutiqueNavbarComponent, FooterComponent],
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss']
})
export class PromotionsPageComponent {} 