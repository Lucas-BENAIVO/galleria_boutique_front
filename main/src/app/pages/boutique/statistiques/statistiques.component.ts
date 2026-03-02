import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopProduitsComponent } from '../../../components/boutique/top-produits/top-produits.component';
import { VentesParJourComponent } from '../../../components/boutique/ventes-par-jour/ventes-par-jour.component';
import { TopClientsComponent } from '../../../components/boutique/top-clients/top-clients.component';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, TopProduitsComponent, VentesParJourComponent, TopClientsComponent],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent {}
