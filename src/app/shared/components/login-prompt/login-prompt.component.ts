import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GuestDataService } from '../../../core/services/guest-data.service';

@Component({
  selector: 'app-login-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upgrade-banner" *ngIf="!authService.isLoggedIn() && guestDataService.hasGuestData() && !dismissed">
      <div class="banner-content">
        <div class="banner-left">
          <div class="banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
              <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
            </svg>
          </div>
          <div class="banner-text">
            <div class="banner-title">Unlock Premium Features</div>
            <div class="banner-subtitle">Save your {{ guestAnalysisCount }} analysis permanently • Access from any device • Priority support</div>
          </div>
        </div>
        
        <div class="banner-right">
          <div class="pricing-badge">
            <span class="price">$0</span>
            <span class="period">/forever</span>
          </div>
          <div class="banner-actions">
            <button class="btn-upgrade" (click)="goToRegister()">
              <span>Start Free</span>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <button class="btn-login" (click)="goToLogin()">Sign In</button>
          </div>
        </div>
        
        <button class="btn-dismiss" (click)="dismiss()" aria-label="Dismiss">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .upgrade-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 1000;
      max-width: 900px;
      width: calc(100vw - 48px);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }

    .banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      position: relative;
      gap: 24px;
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .banner-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
    }

    .banner-icon svg {
      width: 24px;
      height: 24px;
    }

    .banner-text {
      flex: 1;
      min-width: 0;
    }

    .banner-title {
      font-size: 18px;
      font-weight: 700;
      color: white;
      margin-bottom: 4px;
      letter-spacing: -0.025em;
    }

    .banner-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.4;
    }

    .banner-right {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-shrink: 0;
    }

    .pricing-badge {
      text-align: center;
      color: white;
    }

    .price {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
      display: block;
    }

    .period {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 500;
    }

    .banner-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-upgrade {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-upgrade:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      background: #f8fafc;
    }

    .btn-upgrade svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .btn-upgrade:hover svg {
      transform: translateX(2px);
    }

    .btn-login {
      background: transparent;
      color: white;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      padding: 11px 18px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .btn-login:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    .btn-dismiss {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .btn-dismiss:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .btn-dismiss svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .upgrade-banner {
        bottom: 16px;
        width: calc(100vw - 32px);
      }

      .banner-content {
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        text-align: center;
      }

      .banner-left {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .banner-right {
        flex-direction: column;
        gap: 16px;
      }

      .banner-actions {
        width: 100%;
        justify-content: center;
      }

      .btn-upgrade, .btn-login {
        flex: 1;
        justify-content: center;
      }

      .btn-dismiss {
        top: 8px;
        right: 8px;
      }
    }

    @media (max-width: 480px) {
      .banner-title {
        font-size: 16px;
      }

      .banner-subtitle {
        font-size: 13px;
      }

      .price {
        font-size: 24px;
      }

      .banner-actions {
        flex-direction: column;
        width: 100%;
      }

      .btn-upgrade, .btn-login {
        width: 100%;
      }
    }
  `]
})
export class LoginPromptComponent {
  authService = inject(AuthService);
  guestDataService = inject(GuestDataService);
  private router = inject(Router);
  dismissed = false;

  get guestAnalysisCount(): number {
    return this.guestDataService.getGuestAnalyses().length;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  dismiss(): void {
    this.dismissed = true;
    // Store dismissal in sessionStorage so it doesn't show again this session
    sessionStorage.setItem('login-prompt-dismissed', 'true');
  }

  ngOnInit(): void {
    // Check if already dismissed this session
    this.dismissed = sessionStorage.getItem('login-prompt-dismissed') === 'true';
  }
}