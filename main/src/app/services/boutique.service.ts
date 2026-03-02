import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Boutique {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
  isValidated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoutiqueResponse {
  success: boolean;
  data: Boutique;
  message?: string;
}

export interface UpdateBoutiqueData {
  name?: string;
  description?: string;
  logo?: string;
}

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/boutiques`;

  constructor(private http: HttpClient) {}

  getBoutiqueById(id: string): Observable<BoutiqueResponse> {
    return this.http.get<BoutiqueResponse>(`${this.apiUrl}/${id}`);
  }

  updateBoutique(id: string, data: UpdateBoutiqueData): Observable<BoutiqueResponse> {
    return this.http.put<BoutiqueResponse>(`${this.apiUrl}/${id}`, data);
  }
}
