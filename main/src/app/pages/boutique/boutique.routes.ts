import { Routes } from '@angular/router';

export const BoutiqueRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'produits',
    loadComponent: () => import('./produits/produits.page').then(m => m.ProduitsPage),
  },
  {
    path: 'commandes',
    loadComponent: () => import('./commandes/commandes.page').then(m => m.CommandesPageComponent),
  },
  {
    path: 'promotions',
    loadComponent: () => import('./promotions/promotions.page').then(m => m.PromotionsPageComponent),
  },
  {
    path: 'inventaire',
    loadComponent: () => import('./inventaire/inventaire.page').then(m => m.InventairePageComponent),
  },
  {
    path: 'stock',
    loadComponent: () => import('./inventaire/inventaire.page').then(m => m.InventairePageComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePageComponent),
  },
];
