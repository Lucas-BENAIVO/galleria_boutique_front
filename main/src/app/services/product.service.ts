import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  image?: string;
  categoryId?: string;
  category?: string;
  boutiqueId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export interface ProductsListResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  images?: string[];
  categoryId: string;
  boutiqueId: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/products`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les produits
  getAllProducts(): Observable<ProductsListResponse> {
    return this.http.get<ProductsListResponse>(this.apiUrl);
  }

  // Récupérer les produits d'une boutique
  getProductsByBoutique(boutiqueId: string): Observable<ProductsListResponse> {
    return this.http.get<ProductsListResponse>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  // Récupérer un produit par ID
  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau produit
  createProduct(productData: CreateProductData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, productData);
  }

  // Mettre à jour un produit
  updateProduct(id: string, productData: Partial<CreateProductData>): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, productData);
  }

  // Supprimer un produit
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
