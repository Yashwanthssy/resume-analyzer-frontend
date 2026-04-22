import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        this.error = 'Authentication failed. Please try again.';
        this.isLoading = false;
        this.toastService.error('Authentication failed');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
        return;
      }

      if (token) {
        // Store the token first
        localStorage.setItem('auth_token', token);
        
        // Fetch user data from the backend
        this.authService.fetchCurrentUser().subscribe({
          next: (user) => {
            this.toastService.success('Successfully signed in!');
            this.router.navigate(['/analyzer']);
          },
          error: (error) => {
            console.error('Failed to fetch user data:', error);
            this.error = 'Failed to get user information';
            this.isLoading = false;
            this.toastService.error('Authentication failed');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        });
      } else {
        this.error = 'No authentication token received';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    });
  }
}