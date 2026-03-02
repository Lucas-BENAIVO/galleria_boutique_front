import { Component } from '@angular/core';
import { ProduitsListComponent } from '../../../components/boutique/produits-list/produits-list.component';
import { SidebarComponent } from '../../../components/boutique/sidebar/sidebar.component';
import { BoutiqueNavbarComponent } from '../../../components/boutique/boutique-navbar/boutique-navbar.component';
import { FooterComponent } from '../../../components/boutique/footer/footer.component';

@Component({
  selector: 'app-produits-page',
  standalone: true,
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss']
  ,
  imports: [ProduitsListComponent, SidebarComponent, BoutiqueNavbarComponent, FooterComponent]
})
export class ProduitsPage {}
