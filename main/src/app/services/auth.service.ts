import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

export interface User {
  _id: string;
  id?: string;
  fullName: string;
  email?: string;
  role: string;
  boutiqueId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiNodeUrl}/api/mall/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('boutiqueUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response?.accessToken && response?.refreshToken) {
            localStorage.setItem('boutiqueAccessToken', response.accessToken);
            localStorage.setItem('boutiqueRefreshToken', response.refreshToken);
            localStorage.setItem('boutiqueUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(fullName: string, email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, {
      fullName,
      email,
      password,
      role: 'MANAGER'
    }).pipe(
      tap(response => {
        if (response?.accessToken && response?.refreshToken && response?.user) {
          localStorage.setItem('boutiqueAccessToken', response.accessToken);
          localStorage.setItem('boutiqueRefreshToken', response.refreshToken);
          localStorage.setItem('boutiqueUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('boutiqueAccessToken');
    localStorage.removeItem('boutiqueRefreshToken');
    localStorage.removeItem('boutiqueUser');
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('boutiqueAccessToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?._id || user?.id || null;
  }

  getBoutiqueId(): string | null {
    // Essayer d'abord depuis le BehaviorSubject
    let user = this.currentUserSubject.value;
    if (user?.boutiqueId) {
      return user.boutiqueId;
    }
    // Fallback: relire depuis localStorage
    const savedUser = localStorage.getItem('boutiqueUser');
    if (savedUser) {
      try {
        user = JSON.parse(savedUser);
        if (user?.boutiqueId) {
          this.currentUserSubject.next(user);
          return user.boutiqueId;
        }
      } catch (e) {
        console.error('Error parsing boutiqueUser:', e);
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isBoutiqueOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'BOUTIQUE' || user?.role === 'VENDEUR';
  }
}
