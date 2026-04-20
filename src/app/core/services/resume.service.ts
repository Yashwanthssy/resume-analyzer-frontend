import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalysisResult, HistoryItem } from '../models/resume.model';
import { AuthService } from './auth.service';
import { GuestDataService, GuestAnalysis } from './guest-data.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private guestDataService = inject(GuestDataService);
  private toastService = inject(ToastService);
  private apiUrl = environment.apiUrl;

  analyzeResume(file: File, jobDescription: string): Observable<AnalysisResult> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    // If user is logged in, use backend API
    if (this.authService.isLoggedIn()) {
      return this.http.post<{ success: boolean; data: AnalysisResult }>(
        `${this.apiUrl}/resume/analyze`,
        formData
      ).pipe(
        map(response => response.data)
      );
    }

    // For guest users, use guest API endpoint
    return this.http.post<{ success: boolean; data: AnalysisResult }>(
      `${this.apiUrl}/resume/analyze-guest`,
      formData
    ).pipe(
      map(response => {
        // Save to local storage for guest users
        const guestAnalysis: GuestAnalysis = {
          id: response.data.id,
          fileName: response.data.fileName,
          jobDescription,
          analysisResult: response.data,
          createdAt: new Date().toISOString()
        };
        this.guestDataService.saveGuestAnalysis(guestAnalysis);
        return response.data;
      }),
      catchError(error => {
        this.toastService.error(
          'Analysis Failed',
          'Unable to analyze your resume. Please try again.',
          {
            label: 'Retry',
            handler: () => {
              // Could implement retry logic here
            }
          }
        );
        throw error;
      })
    );
  }

  getHistory(): Observable<HistoryItem[]> {
    // If user is logged in, get from backend
    if (this.authService.isLoggedIn()) {
      return this.http.get<HistoryItem[]>(`${this.apiUrl}/resume/history`);
    }

    // For guest users, get from local storage
    return this.guestDataService.guestAnalyses$.pipe(
      map(analyses => analyses.map(analysis => ({
        id: analysis.id,
        fileName: analysis.fileName,
        score: analysis.analysisResult.matchScore,
        createdAt: analysis.createdAt
      })))
    );
  }

  getHistoryById(id: string): Observable<AnalysisResult> {
    // If user is logged in, get from backend
    if (this.authService.isLoggedIn()) {
      return this.http.get<AnalysisResult>(`${this.apiUrl}/resume/history/${id}`);
    }

    // For guest users, get from local storage
    const guestAnalyses = this.guestDataService.getGuestAnalyses();
    const analysis = guestAnalyses.find(a => a.id === id);
    
    if (analysis) {
      return of(analysis.analysisResult);
    }
    
    throw new Error('Analysis not found');
  }

  deleteHistory(id: string): Observable<void> {
    // If user is logged in, delete from backend
    if (this.authService.isLoggedIn()) {
      return this.http.delete<void>(`${this.apiUrl}/resume/history/${id}`);
    }

    // For guest users, remove from local storage
    const currentAnalyses = this.guestDataService.getGuestAnalyses();
    const filteredAnalyses = currentAnalyses.filter(a => a.id !== id);
    localStorage.setItem('guest_analyses', JSON.stringify(filteredAnalyses));
    
    return of(void 0);
  }

  // Method to migrate guest data to user account after login
  async migrateGuestDataToUser(): Promise<void> {
    if (!this.authService.isLoggedIn() || !this.guestDataService.hasGuestData()) {
      return;
    }

    const guestAnalyses = this.guestDataService.getGuestAnalyses();
    
    try {
      // Send guest data to backend for migration
      await this.http.post(`${this.apiUrl}/resume/migrate-guest-data`, {
        guestAnalyses
      }).toPromise();
      
      // Clear guest data after successful migration
      this.guestDataService.clearGuestData();
      
      this.toastService.success(
        'Data Migrated Successfully',
        `${guestAnalyses.length} analysis${guestAnalyses.length > 1 ? 'es' : ''} saved to your account.`
      );
    } catch (error) {
      this.toastService.error(
        'Migration Failed',
        'Unable to save your previous analyses. They are still available locally.',
        {
          label: 'Try Again',
          handler: () => {
            this.migrateGuestDataToUser();
          }
        }
      );
      // Don't clear guest data if migration failed
    }
  }
}
