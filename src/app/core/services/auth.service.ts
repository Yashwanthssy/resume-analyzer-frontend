import { Injectable, inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, LoginDto, RegisterDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() {
    // Initialize user from storage on service creation
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    
    if (token && user) {
      // Set user immediately from storage
      this.currentUserSubject.next(user);
      
      // Then verify token is still valid
      this.fetchCurrentUser().subscribe({
        next: (validUser) => {
          // Token validation successful
        },
        error: (error) => {
          // Token validation failed, clear auth data
          this.clearAuthData();
        }
      });
    } else if (token && !user) {
      // We have a token but no user data, fetch it
      this.fetchCurrentUser().subscribe({
        error: (error) => {
          this.clearAuthData();
        }
      });
    } else {
      // No token or user, ensure we're in logged out state
      this.currentUserSubject.next(null);
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto).pipe(
      tap(response => {
        this.setAuthData(response);
        // Trigger data migration after successful registration
        this.triggerDataMigration();
      })
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(response => {
        this.setAuthData(response);
        // Trigger data migration after successful login
        this.triggerDataMigration();
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/analyzer']); // Redirect to analyzer instead of login
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  refreshAuthState(): void {
    this.initializeAuth();
  }

  setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  }

  private triggerDataMigration(): void {
    // Check if there's guest data before migration
    const hasGuestData = localStorage.getItem('guest_analyses') !== null;
    
    if (hasGuestData) {
      sessionStorage.setItem('had-guest-data', 'true');
    }
    sessionStorage.setItem('just-logged-in', 'true');

    // Import ResumeService dynamically to avoid circular dependency
    import('./resume.service').then(({ ResumeService }) => {
      const resumeService = this.injector.get(ResumeService);
      resumeService.migrateGuestDataToUser().catch(error => {
        console.error('Data migration failed:', error);
      });
    });
  }

  private injector = inject(Injector);
}
