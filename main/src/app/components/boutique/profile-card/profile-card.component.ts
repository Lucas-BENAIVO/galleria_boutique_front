import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueService, Boutique, UpdateBoutiqueData } from '../../../services/boutique.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  boutique: Boutique | null = null;
  loading = false;
  error = '';
  editMode = false;
  saving = false;

  editData = {
    name: '',
    description: ''
  };

  constructor(
    private boutiqueService: BoutiqueService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBoutique();
  }

  loadBoutique() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) {
      this.error = 'Boutique non trouvée';
      return;
    }

    this.loading = true;
    this.boutiqueService.getBoutiqueById(boutiqueId).subscribe({
      next: (res) => {
        this.boutique = res.data;
        this.editData.name = this.boutique?.name || '';
        this.editData.description = this.boutique?.description || '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement boutique:', err);
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.boutique) {
      this.editData.name = this.boutique.name;
      this.editData.description = this.boutique.description || '';
    }
  }

  saveBoutique() {
    if (!this.boutique) return;

    this.saving = true;
    const data: UpdateBoutiqueData = {
      name: this.editData.name,
      description: this.editData.description
    };

    this.boutiqueService.updateBoutique(this.boutique._id, data).subscribe({
      next: (res) => {
        this.boutique = res.data;
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        alert('Erreur lors de la mise à jour');
        this.saving = false;
      }
    });
  }
}
