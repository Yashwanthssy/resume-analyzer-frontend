import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResumeService } from '../../core/services/resume.service';
import { HistoryItem } from '../../core/models/resume.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  private resumeService = inject(ResumeService);
  private router = inject(Router);

  historyItems = signal<HistoryItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.resumeService.getHistory().subscribe({
      next: (items) => {
        this.historyItems.set(items);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load history. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  viewDetails(id: string) {
    this.router.navigate(['/history', id]);
  }

  deleteItem(id: string, event: Event) {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    this.resumeService.deleteHistory(id).subscribe({
      next: () => {
        this.historyItems.update(items => items.filter(item => item.id !== id));
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete analysis. Please try again.');
      }
    });
  }

  getScoreColor(score: number): string {
    if (score > 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  }

  getVerdict(score: number): string {
    if (score > 85) return 'Strong Match';
    if (score > 70) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Weak Match';
  }

  getVerdictClass(score: number): string {
    if (score > 85) return 'strong';
    if (score > 70) return 'good';
    if (score >= 40) return 'partial';
    return 'weak';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}
