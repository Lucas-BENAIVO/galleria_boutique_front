import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('boutiqueAccessToken');

    // Ajouter le token à la requête si présent
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          const refreshToken = localStorage.getItem('boutiqueRefreshToken');

          if (!refreshToken) {
            this.logout();
            return throwError(() => error);
          }

          // Appel API pour refresh le token
          return this.http.post<any>(
            `${environment.apiNodeUrl}/api/mall/auth/refresh`,
            { refreshToken }
          ).pipe(
            switchMap(data => {
              localStorage.setItem('boutiqueAccessToken', data.accessToken);
              if (data.refreshToken) {
                localStorage.setItem('boutiqueRefreshToken', data.refreshToken);
              }

              // Rejouer la requête initiale avec le nouveau token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${data.accessToken}`
                }
              });

              return next.handle(retryReq);
            }),
            catchError(err => {
              this.logout();
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private logout(): void {
    localStorage.removeItem('boutiqueAccessToken');
    localStorage.removeItem('boutiqueRefreshToken');
    localStorage.removeItem('boutiqueUser');
    window.location.href = '/authentication/login';
  }
}
