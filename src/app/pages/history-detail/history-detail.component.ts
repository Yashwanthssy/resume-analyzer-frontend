import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../../core/services/resume.service';
import { AnalysisResult } from '../../core/models/resume.model';
import { ScoreRingComponent } from '../../shared/components/score-ring/score-ring.component';

@Component({
  selector: 'app-history-detail',
  standalone: true,
  imports: [CommonModule, ScoreRingComponent],
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.scss'
})
export class HistoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);

  analysisResult = signal<AnalysisResult | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnalysis(id);
    }
  }

  loadAnalysis(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.resumeService.getHistoryById(id).subscribe({
      next: (result) => {
        this.analysisResult.set(result);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Analysis not found or failed to load.');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/history']);
  }

  getVerdictClass(verdict: string): string {
    const verdictMap: { [key: string]: string } = {
      'Strong Match': 'strong',
      'Good Match': 'good',
      'Partial Match': 'partial',
      'Weak Match': 'weak'
    };
    return verdictMap[verdict] || 'weak';
  }
}
