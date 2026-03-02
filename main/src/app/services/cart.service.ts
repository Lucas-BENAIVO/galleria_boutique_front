import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCount.asObservable();

  constructor() {
    // Charger le panier depuis localStorage au démarrage
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItems.next(items);
      this.updateCartCount(items);
    }
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem('shoppingCart', JSON.stringify(items));
  }

  private updateCartCount(items: CartItem[]) {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(count);
  }

  addToCart(product: any, selectedSize: string, selectedColor: string) {
    const currentItems = this.cartItems.value;
    
    // Vérifier si le produit existe déjà avec la même taille et couleur
    const existingItemIndex = currentItems.findIndex(
      item => item.productId === product.id && 
              item.size === selectedSize && 
              item.color === selectedColor
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // Augmenter la quantité si le produit existe
      updatedItems = currentItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Ajouter un nouveau produit
      const newItem: CartItem = {
        id: Date.now(), // ID unique basé sur timestamp
        productId: product.id || 1,
        name: product.name || 'Produit',
        category: product.category || 'PRODUCT',
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
        price: product.price || 0,
        image: product.image || ''
      };
      updatedItems = [...currentItems, newItem];
    }

    this.cartItems.next(updatedItems);
    this.updateCartCount(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  updateQuantity(itemId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    this.cartItems.next(updatedItems);
    this.updateCartCount(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  removeItem(itemId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);

    this.cartItems.next(updatedItems);
    this.updateCartCount(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart() {
    this.cartItems.next([]);
    this.cartCount.next(0);
    localStorage.removeItem('shoppingCart');
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getCartCount(): number {
    return this.cartCount.value;
  }

  getSubtotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 50 ? 0 : 0; // Livraison gratuite au-dessus de 50€
  }

  getTax(): number {
    return this.getSubtotal() * 0.19; // 19% TVA
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }
}
