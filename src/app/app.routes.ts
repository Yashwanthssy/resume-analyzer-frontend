import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/analyzer',
    pathMatch: 'full'
  },
  {
    path: 'analyzer',
    loadComponent: () => import('./pages/analyzer/analyzer.component').then(m => m.AnalyzerComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./pages/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'history/:id',
    loadComponent: () => import('./pages/history-detail/history-detail.component').then(m => m.HistoryDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    redirectTo: '/analyzer',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/analyzer'
  }
];