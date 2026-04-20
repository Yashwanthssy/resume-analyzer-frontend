import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone request and add authorization header if token exists
  // Skip auth header for guest endpoints
  if (token && !req.url.includes('/analyze-guest')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // If 401 Unauthorized, logout user (but not for guest endpoints)
      if (error.status === 401 && !req.url.includes('/analyze-guest')) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
