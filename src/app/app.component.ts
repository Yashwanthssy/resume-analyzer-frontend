import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginPromptComponent } from './shared/components/login-prompt/login-prompt.component';
import { MigrationSuccessComponent } from './shared/components/migration-success/migration-success.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoginPromptComponent, MigrationSuccessComponent, ToastComponent],
  template: `
    <div class="app">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-login-prompt></app-login-prompt>
      <app-migration-success></app-migration-success>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
      padding-top: 80px; /* Account for fixed navbar */
    }
  `]
})
export class AppComponent {
  title = 'ResumeAI';
}