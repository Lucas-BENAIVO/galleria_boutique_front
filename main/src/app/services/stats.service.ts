import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

export interface TopProduct {
  _id: string;
  nom: string;
  ventes: number;
  revenue: number;
}

export interface SalesByDay {
  jour: string;
  date: string;
  ventes: number;
  revenue: number;
}

export interface TopClient {
  _id: string;
  nom: string;
  email: string;
  total: number;
  commandes: number;
}

export interface TopProductsResponse {
  success: boolean;
  data: TopProduct[];
}

export interface SalesByDayResponse {
  success: boolean;
  data: SalesByDay[];
}

export interface TopClientsResponse {
  success: boolean;
  data: TopClient[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/stats`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les top produits vendus d'une boutique
   */
  getTopProducts(boutiqueId: string, month?: number, year?: number): Observable<TopProductsResponse> {
    let url = `${this.apiUrl}/top-products/${boutiqueId}`;
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return this.http.get<TopProductsResponse>(url);
  }

  /**
   * Récupère les ventes par jour (derniers 7 jours)
   */
  getSalesByDay(boutiqueId: string): Observable<SalesByDayResponse> {
    return this.http.get<SalesByDayResponse>(`${this.apiUrl}/sales-by-day/${boutiqueId}`);
  }

  /**
   * Récupère les top clients d'une boutique
   */
  getTopClients(boutiqueId: string, month?: number, year?: number): Observable<TopClientsResponse> {
    let url = `${this.apiUrl}/top-clients/${boutiqueId}`;
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return this.http.get<TopClientsResponse>(url);
  }
}
