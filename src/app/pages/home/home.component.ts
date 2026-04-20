import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
      <div class="hero">
        <h2>Welcome to ResumeAI</h2>
        <p>Your AI-powered resume analyzer is ready!</p>
        <div class="status">
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Frontend: Working</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Deployment: Successful</span>
          </div>
          <div class="status-item">
            <span class="status-icon">🚀</span>
            <span>Ready for features</span>
          </div>
        </div>
        <button class="cta-button" (click)="showMessage()">
          Test Application
        </button>
        <div *ngIf="message" class="message">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .hero {
      padding: 3rem 2rem;
    }
    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .hero p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }
    .status {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .status-icon {
      font-size: 1.2rem;
    }
    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .message {
      margin-top: 1rem;
      padding: 1rem;
      background: #e8f5e8;
      border-radius: 8px;
      color: #2d5a2d;
    }
    @media (max-width: 768px) {
      .status {
        flex-direction: column;
        align-items: center;
      }
      .hero h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent {
  message = '';

  showMessage() {
    this.message = '🎉 Application is working perfectly! Ready to add resume analysis features.';
  }
}