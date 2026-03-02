import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
  message?: string;
}

export interface CategoriesListResponse {
  success: boolean;
  count: number;
  data: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/categories`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les catégories
  getAllCategories(): Observable<CategoriesListResponse> {
    return this.http.get<CategoriesListResponse>(this.apiUrl);
  }

  // Récupérer une catégorie par ID
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }
}
