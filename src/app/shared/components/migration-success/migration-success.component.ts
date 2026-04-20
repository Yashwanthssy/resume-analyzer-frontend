import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-migration-success',
  standalone: true,
  template: ``, // Empty template since we're using toast
  styles: []
})
export class MigrationSuccessComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    // Show toast if user just logged in and had guest data
    const justLoggedIn = sessionStorage.getItem('just-logged-in');
    const hadGuestData = sessionStorage.getItem('had-guest-data');
    
    if (justLoggedIn === 'true' && hadGuestData === 'true') {
      this.toastService.success(
        'Welcome back!',
        'Your previous analyses have been saved to your account.',
        {
          label: 'View History',
          handler: () => {
            // Navigate to history page
            window.location.href = '/history';
          }
        }
      );
      
      // Clear the flags
      sessionStorage.removeItem('just-logged-in');
      sessionStorage.removeItem('had-guest-data');
    }
  }
}