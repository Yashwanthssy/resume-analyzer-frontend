import { Routes } from '@angular/router';

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
    path: 'history',
    loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'history/:id',
    loadComponent: () => import('./pages/history-detail/history-detail.component').then(m => m.HistoryDetailComponent)
  }
];