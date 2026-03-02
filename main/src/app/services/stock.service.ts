import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StockItem {
  _id: string | null;
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  alertThreshold: number;
  updatedAt?: string;
}

export interface StockTransaction {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images?: string[];
  };
  boutiqueId: string;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'VENTE' | 'RETOUR';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string;
}

export interface StockResponse {
  success: boolean;
  data: StockItem;
}

export interface StocksListResponse {
  success: boolean;
  count: number;
  data: StockItem[];
}

export interface TransactionsListResponse {
  success: boolean;
  count: number;
  data: StockTransaction[];
}

export interface UpdateStockData {
  productId: string;
  quantity: number;
  alertThreshold?: number;
  type?: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/stocks`;

  constructor(private http: HttpClient) {}

  getStocksByBoutique(boutiqueId: string): Observable<StocksListResponse> {
    return this.http.get<StocksListResponse>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  getStockByProduct(productId: string): Observable<StockResponse> {
    return this.http.get<StockResponse>(`${this.apiUrl}/product/${productId}`);
  }

  getLowStockProducts(boutiqueId?: string): Observable<StocksListResponse> {
    const params = boutiqueId ? `?boutiqueId=${boutiqueId}` : '';
    return this.http.get<StocksListResponse>(`${this.apiUrl}/low${params}`);
  }

  updateStock(data: UpdateStockData): Observable<StockResponse> {
    return this.http.put<StockResponse>(this.apiUrl, data);
  }

  getStockTransactions(boutiqueId: string, limit = 50): Observable<TransactionsListResponse> {
    return this.http.get<TransactionsListResponse>(`${this.apiUrl}/transactions/boutique/${boutiqueId}?limit=${limit}`);
  }

  getProductTransactions(productId: string, limit = 20): Observable<TransactionsListResponse> {
    return this.http.get<TransactionsListResponse>(`${this.apiUrl}/transactions/product/${productId}?limit=${limit}`);
  }
}
