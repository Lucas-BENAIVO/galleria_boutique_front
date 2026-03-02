import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionsFormComponent } from '../promotions-form/promotions-form.component';
import { PromotionService, Promotion, CreatePromotionData } from '../../../services/promotion.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PromotionsFormComponent],
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent implements OnInit {
  showForm = false;
  editPromotion: Promotion | null = null;
  selectedStatus: string = '';
  loading = false;
  error = '';

  promotions: Promotion[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private promotionService: PromotionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPromotions();
  }

  loadPromotions() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) {
      this.error = 'Boutique non trouvée';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.promotionService.getPromotionsByBoutique(boutiqueId).subscribe({
      next: (res) => {
        this.promotions = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement promotions:', err);
        this.error = 'Erreur lors du chargement des promotions';
        this.loading = false;
      }
    });
  }

  getStatus(promo: Promotion): string {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    
    if (now < start) return 'À venir';
    if (now > end) return 'Expiré';
    return 'Actif';
  }

  get filteredPromotions() {
    if (!this.selectedStatus) return this.promotions;
    return this.promotions.filter(p => this.getStatus(p) === this.selectedStatus);
  }

  get paginatedPromotions(): Promotion[] {
    const filtered = this.filteredPromotions;
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

  openAddForm() {
    this.editPromotion = null;
    this.showForm = true;
  }

  openEditForm(promotion: Promotion) {
    this.editPromotion = { ...promotion };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editPromotion = null;
  }

  deletePromotion(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;
    
    this.promotionService.deletePromotion(id).subscribe({
      next: () => {
        this.promotions = this.promotions.filter(p => p._id !== id);
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  onSavePromotion(data: any) {
    const boutiqueId = this.authService.getBoutiqueId();
    if (!boutiqueId) {
      alert('Boutique non trouvée');
      return;
    }

    const promotionData: CreatePromotionData = {
      title: data.title,
      discountPercent: data.discountPercent,
      startDate: data.startDate,
      endDate: data.endDate,
      boutiqueId: boutiqueId,
      productIds: data.productIds || []
    };

    if (this.editPromotion?._id) {
      this.promotionService.updatePromotion(this.editPromotion._id, promotionData).subscribe({
        next: (res) => {
          this.loadPromotions();
          this.closeForm();
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          alert('Erreur lors de la mise à jour');
        }
      });
    } else {
      this.promotionService.createPromotion(promotionData).subscribe({
        next: (res) => {
          this.loadPromotions();
          this.closeForm();
        },
        error: (err) => {
          console.error('Erreur création:', err);
          alert('Erreur lors de la création');
        }
      });
    }
  }
}