import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

export interface Promotion {
  _id: string;
  title: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  boutiqueId?: string;
  productIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionResponse {
  success: boolean;
  data: Promotion;
  message?: string;
}

export interface PromotionsListResponse {
  success: boolean;
  count: number;
  data: Promotion[];
}

export interface CreatePromotionData {
  title: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  boutiqueId: string;
  productIds?: string[];
}

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/promotions`;

  constructor(private http: HttpClient) {}

  getAllPromotions(): Observable<PromotionsListResponse> {
    return this.http.get<PromotionsListResponse>(this.apiUrl);
  }

  getPromotionsByBoutique(boutiqueId: string): Observable<PromotionsListResponse> {
    return this.http.get<PromotionsListResponse>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  getPromotionById(id: string): Observable<PromotionResponse> {
    return this.http.get<PromotionResponse>(`${this.apiUrl}/${id}`);
  }

  createPromotion(data: CreatePromotionData): Observable<PromotionResponse> {
    return this.http.post<PromotionResponse>(this.apiUrl, data);
  }

  updatePromotion(id: string, data: Partial<CreatePromotionData>): Observable<PromotionResponse> {
    return this.http.put<PromotionResponse>(`${this.apiUrl}/${id}`, data);
  }

  deletePromotion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
