import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListComponent } from '../../../components/boutique/stock-list/stock-list.component';
import { SidebarComponent } from '../../../components/boutique/sidebar/sidebar.component';
import { BoutiqueNavbarComponent } from '../../../components/boutique/boutique-navbar/boutique-navbar.component';
import { FooterComponent } from '../../../components/boutique/footer/footer.component';

@Component({
  selector: 'app-inventaire-page',
  standalone: true,
  imports: [CommonModule, StockListComponent, SidebarComponent, BoutiqueNavbarComponent, FooterComponent],
  templateUrl: './inventaire.page.html',
  styleUrls: ['./inventaire.page.scss']
})
export class InventairePageComponent {}
