import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  productId: string;
  boutiqueId: string;
  quantity: number;
  price: number;
  status: 'PREPARATION' | 'EN_COURS' | 'LIVRE';
  product?: {
    name: string;
    price: number;
    images: string[];
  };
}

export interface Order {
  _id: string;
  userId: string | { _id: string; fullName: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED';
  deliveryType: 'RETRAIT' | 'LIVRAISON';
  createdAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  count: number;
  data: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/orders`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les commandes
  getAllOrders(): Observable<OrdersListResponse> {
    return this.http.get<OrdersListResponse>(this.apiUrl);
  }

  // Récupérer une commande par ID
  getOrderById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les commandes d'un utilisateur
  getOrdersByUser(userId: string): Observable<OrdersListResponse> {
    return this.http.get<OrdersListResponse>(`${this.apiUrl}/user/${userId}`);
  }

  // Récupérer les commandes d'une boutique
  getOrdersByBoutique(boutiqueId: string): Observable<OrdersListResponse> {
    return this.http.get<OrdersListResponse>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  // Mettre à jour le statut d'un item
  updateItemStatus(orderId: string, productId: string, status: 'PREPARATION' | 'EN_COURS' | 'LIVRE'): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/item-status`, {
      orderId,
      productId,
      status
    });
  }

  // Mapper le statut pour l'affichage
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PREPARATION': 'En préparation',
      'EN_COURS': 'En cours',
      'LIVRE': 'Livrée',
      'PENDING': 'En attente',
      'PAID': 'Payée',
      'CANCELLED': 'Annulée'
    };
    return statusMap[status] || status;
  }

  // Mapper la couleur du statut
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PREPARATION': '#ffc107',
      'EN_COURS': '#17a2b8',
      'LIVRE': '#28a745',
      'PENDING': '#ffc107',
      'PAID': '#28a745',
      'CANCELLED': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  }
}
