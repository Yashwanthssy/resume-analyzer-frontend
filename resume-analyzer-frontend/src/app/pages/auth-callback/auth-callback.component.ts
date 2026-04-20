import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const name = params['name'];
      const email = params['email'];

      if (token && name && email) {
        // Set auth data
        this.authService.setAuthData({
          success: true,
          token,
          user: {
            id: '', // Will be populated from token
            name,
            email,
            avatar: undefined
          }
        });

        // Navigate to analyzer
        setTimeout(() => {
          this.router.navigate(['/analyzer']);
        }, 500);
      } else {
        // No token, redirect to login with error
        this.router.navigate(['/login'], {
          queryParams: { error: 'Authentication failed' }
        });
      }
    });
  }
}
