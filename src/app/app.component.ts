import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app">
      <header>
        <h1>ResumeAI</h1>
        <p>AI-Powered Resume Analyzer</p>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'ResumeAI';
}